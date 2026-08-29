<script>
	const oneMinute = 1000 * 60;
	const oneHour = oneMinute * 60;

	function tToH(milliseconds = 0) {
		let m = (Math.floor(milliseconds / 1000 / 60) % 60).toString();
		let h = (Math.floor(milliseconds / 1000 / 60 / 60) % 24).toString();

		m = m.padStart(2, '0');
		h = h.padStart(2, '0');

		return `${h}:${m}`;
	}

	const week = [
		{
			name: 'Lundi',
			events: [
				{
					id: 'training',
					title: 'Sambo training\n(Prépa physique – dès 16 ans)',
					start: oneHour * 18,
					end: oneHour * 19
				},
				{
					id: 'adult',
					title: 'Sambo adultes\n(Dès 18 ans)',
					start: oneHour * 19,
					end: oneHour * 20 + oneMinute * 30
				}
			]
		},
		{
			name: 'Mardi',
			events: [
				{
					id: 'young',
					title: 'Enfants / Ados',
					start: oneHour * 17 + oneMinute * 45,
					end: oneHour * 18 + oneMinute * 45
				},
				{
					id: 'adult',
					title: 'Adultes\n(Dès 18 ans)',
					start: oneHour * 18 + oneMinute * 45,
					end: oneHour * 20
				}
			]
		},
		{
			name: 'Mercredi',
			events: []
		},
		{
			name: 'Jeudi',
			events: [
				{
					id: 'baby',
					title: 'Baby Sambo\n(4 / 6 ans)',
					start: oneHour * 17 + oneMinute * 15,
					end: oneHour * 18
				},
				{
					id: 'young',
					title: 'Sambo enfants / Ados',
					start: oneHour * 18,
					end: oneHour * 19 + oneMinute * 30
				}
			]
		},
		{
			name: 'Vendredi',
			events: []
		},
		{
			name: 'Samedi',
			events: []
		},
		{
			name: 'Dimanche',
			events: []
		}
	];

	/** @type {Record<string, { fg: string; bg: string; }>} */
	const themes = {
		adult: {
			bg: 'var(--scv-red)',
			fg: 'white'
		},
		young: {
			bg: 'var(--scv-blue)',
			fg: 'white'
		},
		baby: {
			bg: 'var(--scv-cyan)',
			fg: 'white'
		},
		training: {
			bg: '#6b55b4',
			fg: 'white'
		}
	};

	const groups = [
		{ id: 'baby', label: 'Baby Sambo' },
		{ id: 'young', label: 'Enfants / Ados' },
		{ id: 'adult', label: 'Adultes' },
		{ id: 'training', label: 'Sambo training' }
	];
</script>

<h2 class="section-title">
	<iconify-icon icon="fa6-solid:calendar-days"></iconify-icon>
	Horaires des entraînements
</h2>

<p class="season">Saison 2026–2027</p>

<div class="legend">
	{#each groups as group}
		<span class="chip" style="--bg: {themes[group.id].bg}">{group.label}</span>
	{/each}
</div>

<div class="calendar">
	{#each week as day}
		<div class="day" class:empty={day.events.length === 0}>
			<div class="name">{day.name}</div>
			<div class="events">
				{#each day.events as event}
					{@const theme = themes[event.id]}
					<div class="event" style="--fg: {theme.fg}; --bg: {theme.bg}">
						<div class="title">{event.title}</div>
						<div class="time">
							<iconify-icon icon="fa6-solid:clock"></iconify-icon>
							{tToH(event.start)} – {tToH(event.end)}
						</div>
					</div>
				{:else}
					<div class="rest">Repos</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.section-title {
		color: var(--scv-red);
		justify-content: center;
		margin-bottom: 0.75rem;
	}

	.season {
		width: max-content;
		margin: 0 auto 1.75rem;
		padding: 0.35rem 0.8rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--scv-red) 12%, white);
		color: var(--scv-red);
		font-size: 0.85rem;
		font-weight: 700;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.25rem;
		margin-bottom: 2rem;

		.chip {
			display: inline-flex;
			align-items: center;
			gap: 0.5rem;
			font-weight: 500;
			font-size: 0.9rem;

			&::before {
				content: '';
				width: 0.9rem;
				height: 0.9rem;
				border-radius: 999px;
				background: var(--bg);
			}
		}
	}

	.calendar {
		display: grid;
		grid-template-columns: repeat(7, 1fr);

		background: #fff;
		color: var(--color-900);
		padding: 0.5rem;
		border-radius: 1rem;
		box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.08);

		.day {
			display: flex;
			flex-direction: column;

			&:not(:last-child) {
				border-right: 1px solid var(--color-100);
			}

			> .name {
				padding: 0.75rem 0.5rem;
				text-align: center;
				font-weight: 600;
				border-bottom: 1px solid var(--color-100);
			}

			> .events {
				flex: 1;
				padding: 0.5rem 0;

				.event {
					margin: 0.4rem;
					padding: 0.6rem 0.5rem;
					border-radius: 0.6rem;

					background: var(--bg);
					color: var(--fg);
					text-align: center;

					.title {
						font-weight: 600;
						margin-bottom: 0.5rem;
						font-size: 0.95rem;
						white-space: pre-wrap;
					}

					.time {
						display: flex;
						align-items: center;
						justify-content: center;
						gap: 0.35rem;
						font-weight: 600;
						font-size: 0.85rem;
					}
				}

				.rest {
					text-align: center;
					padding: 1rem 0.5rem;
					font-style: italic;
					font-size: 0.8rem;
					color: var(--color-300);
				}
			}
		}
	}

	/* mobile : on empile et on masque les jours de repos */
	@media (max-width: 760px) {
		.calendar {
			grid-template-columns: 1fr;
			padding: 0.75rem;

			.day {
				&:not(:last-child) {
					border-right: none;
				}

				&.empty {
					display: none;
				}

				> .name {
					text-align: left;
					font-size: 1.05rem;
					border-bottom: none;
					padding-bottom: 0.25rem;
				}

				> .events {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
					gap: 0.5rem;
					padding-top: 0;
					padding-bottom: 1rem;

					.event {
						margin: 0;
					}
				}
			}
		}
	}
</style>
