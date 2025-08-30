<script>
	import pavel_src from './images/masters/pavel.png';
	import julien_src from './images/masters/julien.jpg';
	import olivier_src from './images/masters/olivier_duhouvre.jpg';

	import pdf_download_link from './images/signin.pdf';

	const masters = [
		{
			avatar: olivier_src,
			name: 'Olivier Duhouvre',
			text: `Enseignant principal du club

Initiateur sambo CFS, animateur sambo FFL

Champion de france sambo sportif et combat master,
5e championnat du monde 2012,
1ere dan sambo sportif combat et défense`
		},
		{
			avatar: pavel_src,
			name: 'Pavel',
			text: `2e au championnat régional Occitanie par équipe.

Initiateur sambo CFS`
		},
		{
			avatar: julien_src,
			name: 'Julien',
			text: `Champion régional sambo sportif 2025

3e au championnat de France 2025

2e au championnat par équipe 2025. Initiateur sambo CFS`
		}
	];

	function download() {
		const link = document.createElement('a');
		link.download = 'fiche_inscription_scv';
		link.href = pdf_download_link;
		link.click();
		link.remove();
	}
</script>

<div class="container">
	<p>Cliquez sur le bouton pour télécharger la fiche d'inscription à imprimer et à compléter.</p>
	<p>Il faudra venir avec.</p>
	<button on:click={download}>
		<iconify-icon icon="fa6-solid:download"></iconify-icon>
		Télécharger la fiche d'inscription
	</button>

	<div class="masters">
		<p class="title">L'équipe enseignante</p>

		<div class="list">
			{#each masters as master}
				<div class="master">
					<img src={master.avatar} alt="" />
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
				justify-content: center;
				gap: 2rem;
			}

			.title {
				text-align: center;
				margin-bottom: 2rem;
			}

			.master {
				display: flex;
				align-items: flex-start;
				gap: 1rem;

				img {
					$size: 6rem;
					width: $size;
					height: $size;

					object-fit: cover;

					flex-shrink: 0;

					border-radius: 1rem;
				}

				.infos {
					display: flex;
					flex-direction: column;
					gap: 0.35rem;

					.name {
						font-weight: 600;
					}

					p {
						font-size: 0.8rem;
						font-weight: 300;
						white-space: pre-wrap;
						opacity: 0.8;
					}
				}
			}
		}
	}

	@media screen and (min-width: 768px) {
		.container {
			padding: 10vw 10vw;

			> p {
				text-align: center;
			}

			button {
				width: max-content;
				margin-inline: auto;
			}

			.masters {
				.master {
					img {
						height: 6rem;
						width: 5rem;
					}
				}
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
