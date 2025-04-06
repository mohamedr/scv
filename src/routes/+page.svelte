<script>
	/**
	 * @type {HTMLElement}
	 */
	let schedulesSection;

	function handleSeeSchedule() {
		console.log('bonsoir');

		schedulesSection.scrollIntoView({ behavior: 'smooth' });
	}

	function tToH(milliseconds = 0) {
		let m = (Math.floor(milliseconds / 1000 / 60) % 60).toString();
		let h = (Math.floor(milliseconds / 1000 / 60 / 60) % 24).toString();

		m = m.padStart(2, '0');
		h = h.padStart(2, '0');

		return `${h}:${m}`;
	}

	const oneMinute = 1000 * 60;
	const oneHour = oneMinute * 60;
	const oneDay = oneHour * 24;

	const week = [
		{
			name: 'Lundi',
			events: []
		},
		{
			name: 'Mardi',
			events: [
				{
					title: 'Enfants',
					start: oneHour * 17 + oneMinute * 45,
					end: oneHour * 18 + oneMinute * 45
				},
				{
					title: 'Adultes',
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
					title: 'Enfants',
					start: oneHour * 17 + oneMinute * 30,
					end: oneHour * 18 + oneMinute * 30
				},
				{
					title: 'Adultes',
					start: oneHour * 18 + oneMinute * 30,
					end: oneHour * 20
				}
			]
		},
		{
			name: 'Vendredi',
			events: []
		},
		{
			name: 'Samedi',
			events: [
				{
					title: 'Adultes',
					start: oneHour * 18,
					end: oneHour * 20
				}
			]
		},
		{
			name: 'Dimanche',
			events: []
		}
	];

	/**
	 * @param {HTMLElement} node
	 * @param {boolean} shouldScroll
	 */
	function inview(node, shouldScroll) {
		function update(v = shouldScroll) {
			if (v) node.scrollIntoView();
		}

		update();

		return { update };
	}
</script>

<main>
	<section class="landing">
		<img
			class="bg"
			src="https://upload.wikimedia.org/wikipedia/commons/1/13/Sambo_at_the_2015_European_Games.jpg"
			alt=""
		/>

		<div class="heading">
			<h1>
				Sambo
				<br />
				Club Vedasien
			</h1>
			<div class="location">
				<iconify-icon icon="fa6-solid:location-dot"></iconify-icon>
				<p>
					Gymnase de la Combe<br />1-19 Av. de la Libération <br />
					<span>Saint-Jean-de-Védas</span>
				</p>
			</div>
			<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. molestiae architecto optio.</p>
			<div class="buttons">
				<button onclick={handleSeeSchedule}>
					<iconify-icon icon="fa6-solid:calendar"></iconify-icon>
					Voir les horaires
				</button>
			</div>
		</div>

		<nav>
			<img class="logo" src="/scv_logo.jpg" alt="" />
		</nav>
	</section>

	<section bind:this={schedulesSection}>
		<div class="calendar">
			<div class="columns">
				<div class="col times">
					<div class="head"></div>
					{#each [...Array(25).keys()] as n}
						<div class="cell time" style="--percent: {((n * oneHour) / oneDay) * 100}%">
							{(n % 24).toString().padStart(2, '0')}:00
						</div>
					{/each}
				</div>
				{#each week as day, weekIndex}
					<div class="col">
						<div class="head">
							{day.name}
						</div>
						{#each day.events as event, eventIndex}
							<div
								class="cell event"
								style="--start: {(event.start / oneDay) * 100}%; --end: {(event.end / oneDay) *
									100}%"
							>
								<p class="title">{event.title}</p>
								<p class="range">
									<iconify-icon icon="fa6-solid:clock"></iconify-icon>
									{tToH(event.start)} - {tToH(event.end)}
								</p>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</section>
</main>

<style lang="scss">
	:root {
		background-color: var(--scv-blue);
	}

	.calendar {
		height: 100%;
		display: grid;
		overflow: auto;

		.columns {
			display: grid;
			grid-template-columns: auto repeat(7, calc(100vw - 7rem));
			height: 200vh;
			z-index: 0;
			padding-top: 2rem;

			.col {
				position: relative;
				display: flex;
				flex-direction: column;
				border-right: 1px solid currentColor;

				.head {
					height: 2rem;
					text-align: center;
					position: sticky;
					top: 0;
					translate: 0 -100%;
					background-color: var(--scv-red);
					border-bottom: 1px solid currentColor;
				}

				&.times {
					font-size: 1rem;
					font-family: monospace;
					position: sticky;
					left: 0;

					.head {
						width: 7rem;
						z-index: 10;
					}
				}

				.cell {
					&.time {
						position: absolute;
						left: 50%;
						top: var(--percent);
						translate: -50% -50%;

						&::after {
							content: '';
							position: absolute;
							left: 5rem;
							top: var(--percent);
							width: calc((100vw - 7rem) * 7);
							height: 1px;
							background-color: currentColor;
							translate: 0 0.55rem;
							opacity: 0.5;
						}
					}

					&.event {
						position: absolute;
						left: 0.5rem;
						right: 0.5rem;
						background-color: rgba(0 0 255 / 25%);
						border-top: 2px solid white;

						top: var(--start);
						bottom: calc(100% - var(--end));
						border-radius: 0.4rem;

						padding: 0.5rem 1rem;

						.title {
							font-weight: 600;
							font-size: 1.1rem;
							margin-bottom: 0.25rem;
						}

						.range {
							display: flex;
							align-items: center;
							gap: 0.5rem;
						}
					}
				}
			}
		}
	}

	main {
		background-color: var(--scv-red);
		color: white;

		section {
			height: 100vh;

			&:not(:first-of-type) {
				padding-top: 7rem;
			}
		}

		.landing {
			position: relative;

			nav {
				position: fixed;

				z-index: 10;

				top: 1rem;
				left: 1rem;

				.logo {
					width: 5rem;
					height: auto;

					z-index: 2;
					border-radius: 0.5rem;
				}
			}

			.heading {
				position: absolute;

				inset: 0;

				color: white;
				backdrop-filter: blur(8px);

				display: flex;
				flex-direction: column;
				padding: 2rem;
				justify-content: center;

				> p {
					margin: 2rem 0;
					line-height: 1.25rem;
				}

				.location {
					display: inline-flex;
					align-items: flex-start;
					gap: 1rem;
					font-size: 1.15rem;
					font-weight: 400;

					iconify-icon {
						margin-top: 0.25rem;
						font-size: 2rem;
					}

					span {
						font-size: 1rem;
						font-weight: 300;
						font-style: italic;
					}
				}

				h1 {
					font-size: 3rem;
					border-bottom: 1px solid currentColor;
					padding-bottom: 3rem;
					margin-bottom: 1.5rem;
				}
			}

			.bg {
				width: 100%;
				height: 100%;
				object-fit: cover;

				filter: brightness(0.5);
			}
		}
	}
</style>
