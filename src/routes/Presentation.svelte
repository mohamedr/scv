<script>
	import khamzat_chimaev_src from './images/masters/khamzat-chimaev.jpg';
	import girl_src from './images/masters/girl.avif';
	import man_src from './images/masters/man.avif';

	const masters = [
		{
			avatar: man_src,
			name: 'Olivier Caca',
			text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		},
		{
			avatar: khamzat_chimaev_src,
			name: 'Khamzat Chimeav',
			text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		},
		{
			avatar: girl_src,
			name: 'Mange merde',
			text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		}
	];
</script>

<div class="container">
	<p>
		Lorem ipsum dolor sit amet consectetur adipisicing elit. molestiae architecto optio. Lorem ipsum
		dolor sit amet
	</p>
	<button>
		<iconify-icon icon="fa6-solid:download"></iconify-icon>
		Télécharger la fiche d'inscription
	</button>

	<div class="masters">
		<p class="title">L'équipe</p>

		<div class="list">
			{#each masters as master}
				<div class="master">
					<img src={master.avatar} />
					<div class="infos">
						<div class="name">{master.name}</div>
						<p>{master.text}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		padding: 2rem;

		display: flex;
		flex-direction: column;
		gap: 1rem;

		.masters {
			margin-top: 4rem;

			.list {
				display: flex;
				flex-direction: column;
				gap: 2rem;
			}

			.title {
				text-align: center;
				margin-bottom: 2rem;
			}

			.master {
				display: flex;
				gap: 1rem;

				img {
					$size: 3rem;
					width: $size;
					height: $size;

					object-fit: cover;

					flex-shrink: 0;

					border-radius: 50%;
				}

				.infos {
					display: grid;
					gap: 0.35rem;

					.name {
						font-weight: 600;
					}

					p {
						font-size: 0.8rem;
						font-weight: 300;
						opacity: 0.8;
					}
				}
			}
		}
	}

	@media screen and (min-width: 768px) {
		.container {
			padding: 10vw 20vw;

			> p {
				text-align: center;
			}

			button {
				width: max-content;
				margin-inline: auto;
			}
		}
	}

	@media screen and (min-width: 1024px) {
		.container {
			.masters {
				.list {
					flex-direction: row;
					gap: 4rem;
				}
			}
		}
	}

	@media screen and (max-width: 1024px) {
		.container {
			.masters {
				.master {
					&:nth-child(2n) {
						flex-direction: row-reverse;

						.infos {
							text-align: end;
						}
					}
				}
			}
		}
	}
</style>
