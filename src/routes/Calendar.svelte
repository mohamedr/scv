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
</script>

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

<style lang="scss">
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
</style>
