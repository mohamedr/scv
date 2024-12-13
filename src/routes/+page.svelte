<main>
	<section class="landing">
		<div>
			<img 
				class="logo" 
				src="/scv_logo.jpg" 
				alt="Logo Sambo Club Vedasien"
			/>
			<div class="heading">
				<div class="location">
					<iconify-icon icon="fa6-solid:location-dot"></iconify-icon>
					<p>Gymnase de la Combe<br />1-19 Av. de la Libération <br /> <span>Saint-Jean-de-Védas</span></p>
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
		background-color: #4665cb;
	}

	main {
		background-color: #f84e45;
		color: white;

		.landing {
			display: grid;
			grid-template-columns: 0.9fr 1fr;
			height: 90vh;
			max-height: 52rem;
			position: relative;
			overflow: hidden;

			&::before {
				content: '';
				position: absolute;
				width: 40rem;
				height: 40rem;
				top: -20rem;
				left: -10rem;
				background: linear-gradient(120deg, #4665cb 35%, #f84e45 65%);
				border-radius: 50%;
				z-index: 1;
			}

			.logo {
				width: 160px;
				height: auto;
				margin: 0.5rem 8rem;

				position: relative;
				z-index: 2;
			}

			.heading {
				position: absolute;

				top: 55%;
				left: 40%;

				translate: -50% -50%;

				.location {
					display: inline-flex;
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
