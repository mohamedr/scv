<script>
	import { DateTime } from 'luxon';

	const monday = DateTime.now()
		.setLocale('fr-FR')
		.startOf('week')
		.set({ hour: 0, minute: 0, seconds: 0, milliseconds: 0 });

	const week = Array(7)
		.keys()
		.toArray()
		.map((n) => monday.plus({ days: n }));

	let selectedDayIndex = $state(1);

	const selectedDay = $derived(week[selectedDayIndex]);

	function timeToPercent(time = DateTime.now()) {
		const from = selectedDay.toMillis();
		const to = selectedDay.set({ hours: 24 }).toMillis();

		const percent = (time.toMillis() - from) / (to - from);

		let y = (percent * 100) % 100;

		if (y < 0) y = 100 + y;

		let x = Math.floor(percent) * 100;

		return { percent, y, x };
	}

	const events = [
		{
			title: 'Enfants',
			start: week[1].set({ hours: 17, minutes: 45 }),
			end: week[1].set({ hours: 18, minutes: 45 })
		},
		{
			title: 'Adultes',
			start: week[1].set({ hours: 18, minutes: 45 }),
			end: week[1].set({ hours: 20 })
		},
		{
			title: 'Enfants',
			start: week[3].set({ hours: 17, minutes: 30 }),
			end: week[3].set({ hours: 18, minutes: 30 })
		},
		{
			title: 'Adultes',
			start: week[3].set({ hours: 18, minutes: 30 }),
			end: week[3].set({ hours: 20 })
		},
		{
			title: 'Adultes',
			start: week[5].set({ hours: 18 }),
			end: week[5].set({ hours: 20 })
		}
	];

	const bars = Array(25).keys().toArray();

	/**
	 * @param {HTMLElement} node
	 * @param {DateTime} day
	 */
	function scrollToFirst(node, day) {
		function update() {
			const events = node.querySelectorAll('.event');
			for (const event of events) {
				if (event instanceof HTMLElement) {
					const start = Number(event.dataset.percent);
					if (start >= 0 && start <= 100) {
						const a = node.getBoundingClientRect();
						const b = event.getBoundingClientRect();

						node.scrollTo({
							behavior: 'smooth',
							top: node.scrollTop + (b.top - a.top)
						});

						break;
					}
				}
			}
		}

		update();

		return { update };
	}
</script>

<div class="calendar">
	<div class="days">
		{#each week as day, index}
			<div class="day" class:selected={selectedDayIndex === index}>
				<div class="name">
					{day.weekdayShort}
				</div>
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="date" onclick={() => (selectedDayIndex = index)}>
					{day.day}
				</div>
			</div>
		{/each}
	</div>
	<div class="timeline" use:scrollToFirst={selectedDay}>
		<div class="container">
			<div class="hours">
				{#each bars.map((n) => selectedDay.plus({ hours: n })) as n, i}
					<div class="time" style:--percent="{(i / 24) * 100}%">{n.toFormat('HH:mm')}</div>
				{/each}
			</div>
			<div class="events">
				{#each bars as n}
					<div class="bar" style:--percent="{(n / 24) * 100}%"></div>
				{/each}
				{#each events as event}
					{@const start = timeToPercent(event.start)}
					{@const end = timeToPercent(event.end)}
					<div
						class="event"
						style:--start="{start.y}%"
						style:--end="{end.y}%"
						style:--x="{start.x}%"
						data-percent={start.percent * 100}
					>
						<div class="name">{event.title}</div>
						<div class="range">
							<iconify-icon icon="fa6-solid:clock"></iconify-icon>
							{event.start.toFormat('HH:mm')} - {event.end.toFormat('HH:mm')}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.calendar {
		height: 100%;
		display: grid;
		grid-template-rows: auto 1fr;
		gap: 0.5rem;

		.days {
			display: flex;
			justify-content: space-around;

			.day {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 0.75rem;
				border-bottom: 2px solid transparent;
				padding-bottom: 0.25rem;

				.name {
					text-align: center;
					opacity: 0.75;
				}

				.date {
					$size: 2.5rem;
					width: $size;
					height: $size;

					display: flex;
					align-items: center;
					justify-content: center;

					border-radius: 0.5rem;

					cursor: pointer;
					opacity: 0.9;
					transition-property: opacity;

					&:hover {
						opacity: 1;
					}

					&:active {
						opacity: 0.5;
					}
				}

				&.selected {
					$bg: rgba(blue, 0.3);
					border-bottom-color: $bg;

					.date {
						background-color: $bg;
					}
				}
			}
		}

		.timeline {
			overflow: auto;
			border-top: 1px solid currentColor;

			.container {
				display: grid;
				grid-template-columns: 4rem 1fr;
				padding-top: 1.5rem;
				padding-bottom: 1.5rem;
				overflow: hidden;

				.hours,
				.events {
					position: relative;
					height: 100rem;
				}

				.hours {
					.time {
						position: absolute;
						left: 0.75rem;
						top: var(--percent);

						translate: 0 -50%;
					}
				}

				.events {
					.bar {
						position: absolute;
						left: 0;
						top: var(--percent);

						translate: 0 -50%;
						background-color: currentColor;
						width: 100%;
						height: 1px;

						opacity: 0.5;
					}

					.event {
						position: absolute;
						padding: 0.5rem 0.75rem;
						border-radius: 0.35rem;

						background-color: rgba(blue, 0.3);
						transition-property: top, bottom, left;

						left: calc(var(--x) + 0.25rem);
						width: calc(100% - 4.5rem);

						border-left: 4px solid blue;

						top: var(--start);
						bottom: calc(100% - var(--end));
						backdrop-filter: blur(2px);

						.name {
							font-size: 1.1rem;
							font-weight: 600;
							margin-bottom: 0.5rem;
						}

						.range {
							display: flex;
							align-items: center;
							gap: 0.5rem;
							font-style: italic;
							opacity: 0.75;
						}
					}
				}
			}
		}
	}
</style>
