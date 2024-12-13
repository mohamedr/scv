<main>
	<section class="landing">
		<div>
			<div class="heading">
				<div class="location">
					<iconify-icon icon="fa6-solid:location-dot"></iconify-icon>
					<p>1-19 Av. de la Libération <br /> <span>Saint-Jean-de-Védas</span></p>
				</div>
				<h1>
					Sambo
					<br />
					Club Vedasien
				</h1>
			</div>
		</div>
		<img
			class="bg"
			src="https://upload.wikimedia.org/wikipedia/commons/1/13/Sambo_at_the_2015_European_Games.jpg"
			alt=""
		/>
	</section>
</main>

<style lang="scss">
	:root {
		background-color: #02134d;
	}

	main {
		background-color: #030f3b;
		color: white;

		.landing {
			display: grid;
			grid-template-columns: 0.9fr 1fr;
			height: 90vh;
			max-height: 52rem;

			position: relative;

			.location {
				display: flex;
				align-items: center;
				gap: 1rem;
				font-size: 1.15rem;
				font-weight: 400;

				iconify-icon {
					font-size: 2.5rem;
				}

				span {
					font-size: 1rem;
					font-weight: 300;
					font-style: italic;
				}
			}

			.heading {
				position: absolute;

				top: 50%;
				left: 40%;

				translate: -50% -50%;

				h1 {
					font-size: 6rem;
				}
			}

			.bg {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
	}
</style>
