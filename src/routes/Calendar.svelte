<script>
	const oneMinute = 1000 * 60;
	const oneHour = oneMinute * 60;
	const oneDay = oneHour * 24;

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
			events: []
		},
		{
			name: 'Mardi',
			events: [
				{
					id: 'young',
					title: 'Enfants',
					start: oneHour * 17 + oneMinute * 45,
					end: oneHour * 18 + oneMinute * 45
				},
				{
					id: 'adult',
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
					id: 'adult',
					title: 'Adultes',
					start: oneHour * 17 + oneMinute * 30,
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
			events: [
				{
					id: 'baby',
					title: 'Baby Sambo\n(4 / 5 ans)',
					start: oneHour * 14,
					end: oneHour * 15
				},
				{
					id: 'young',
					title: 'Enfants',
					start: oneHour * 18,
					end: oneHour * 19 + oneMinute * 30
				},
				{
					id: 'adult',
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
		}
	};
</script>

<div class="container">
	<h1>Horaires des entraînements</h1>

	<div class="calendar">
		{#each week as day}
			<div class="day">
				<div class="name">{day.name}</div>
				<div class="events">
					{#each day.events as event}
						{@const theme = themes[event.id]}
						<div class="event" style="--fg: {theme.fg}; --bg: {theme.bg}">
							<div class="name">
								{event.title}
							</div>
							<div class="time">
								<div class="from">de {tToH(event.start)}</div>
								-
								<div class="to">à {tToH(event.end)}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
	}

	h1 {
		text-align: center;
		margin-bottom: 2rem;
	}

	.calendar {
		display: grid;
		grid-template-columns: repeat(7, 1fr);

		background-color: white;
		color: black;
		margin: 0 2rem;
		padding: 1rem;
		border-radius: 0.5rem;

		.day {
			&:not(:last-child) {
				border-right: 1px solid black;
			}

			> .name {
				padding: 0.5rem;
				text-align: center;
				font-weight: 600;
				border-bottom: 1px solid black;
			}

			> .events {
				> .event {
					margin: 0.5rem;
					padding: 0.5rem;
					border-radius: 0.5rem;

					background-color: var(--bg);
					color: var(--fg);

					> .name {
						font-weight: 500;
						text-align: center;
						margin-bottom: 1rem;
						font-size: 1rem;
						white-space: pre-wrap;
					}

					> .time {
						font-weight: 600;
						display: flex;
						align-items: center;
						justify-content: center;
						gap: 0.5rem;
					}
				}
			}
		}
	}
</style>
