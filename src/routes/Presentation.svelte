<script>
	import { onMount } from 'svelte';

	import pavel_src from './images/masters/pavel-optimized.jpg';
	import julien_src from './images/masters/julien.jpg';
	import olivier_src from './images/masters/olivier_duhouvre.jpg';
	import jj_src from './images/masters/jean-jacques.jpg';
	import jean_rock_src from './images/masters/jean-rock-optimized.jpg';

	import pdf_download_link from './images/signin.pdf';

	let flash = $state(false);

	/** Amène le bouton d'inscription au centre de l'écran et le met en avant. */
	function focusInscription() {
		const el = document.getElementById('inscription');
		if (!el) return;

		el.scrollIntoView({ behavior: 'smooth', block: 'center' });

		flash = false;
		// relance l'animation même si déjà déclenchée
		requestAnimationFrame(() => {
			flash = true;
			setTimeout(() => (flash = false), 2600);
		});
	}

	onMount(() => {
		const handler = () => {
			if (location.hash === '#inscription') focusInscription();
		};

		handler();
		window.addEventListener('hashchange', handler);
		return () => window.removeEventListener('hashchange', handler);
	});

	const masters = [
		{
			avatar: jj_src,
			name: 'Jean-Jacques Teilliet',
			role: 'Président du club',
			text: ''
		},
		{
			avatar: olivier_src,
			name: 'Olivier Duhouvre',
			text: `Enseignant principal du club
Ceinture noire 2e degré de sambo (combat, sportif et défense)
Animateur sambo FFL, initiateur sambo CFS
Titulaire de la formation Sambo Wrestling (préparation physique pour les sports de combat)
Champion de France de sambo sportif et combat master
5e au championnat du monde 2012`
		},
		{
			avatar: julien_src,
			name: 'Julien',
			text: `Initiateur sambo CFS
Champion régional sambo sportif 2025
3e au championnat de France 2025
2e au championnat par équipe 2025`
		},
		{
			avatar: pavel_src,
			name: 'Pavel',
			text: `Ceinture noire de sambo
Initiateur sambo
Vice-champion de France 🇫🇷 2026`
		},
		{
			avatar: jean_rock_src,
			name: 'Jean-Roch',
			text: `Ceinture marron de sambo
Initiateur sambo
Secrétaire adjoint du club`
		}
	];

	function download() {
		const link = document.createElement('a');
		link.download = 'fiche_inscription_scv_2026_2027.pdf';
		link.href = pdf_download_link;
		link.click();
	}
</script>

<h2 class="section-title">
	<iconify-icon icon="fa6-solid:people-group"></iconify-icon>
	L'équipe
</h2>

<div class="team">
	{#each masters as master}
		<article class="card">
			{#if master.avatar}
				<img class="avatar" src={master.avatar} alt={master.name} loading="lazy" decoding="async" />
			{:else}
				<div class="avatar placeholder">
					<iconify-icon icon="fa6-solid:user"></iconify-icon>
				</div>
			{/if}
			<div class="name">{master.name}</div>
			{#if master.role}
				<div class="role">{master.role}</div>
			{/if}
			{#if master.text}
				<p>{master.text}</p>
			{/if}
		</article>
	{/each}
</div>

<div class="join">
	<p>
		<b>Prêt à rejoindre l’équipe&nbsp;?</b>
		Téléchargez la <b>fiche d’inscription</b>, remplissez-la et <b>apportez-la au club</b>. Pensez
		aussi au <b>certificat médical</b> et aux autres documents nécessaires.
	</p>

	<button id="inscription" class="btn-primary big" class:flash onclick={download}>
		<iconify-icon icon="fa6-solid:download"></iconify-icon>
		Télécharger la fiche d'inscription
	</button>

	<p class="muted">
		Au-delà des entraînements, le SCV organise des <b>stages</b> pour progresser plus vite et
		accompagne ses adhérents en <b>compétition</b>, toujours dans l’<b>esprit d’équipe</b>. Parce
		qu’ici, chaque
		<b>victoire</b> est <b>collective</b> et chaque adhérent compte.
	</p>
</div>

<style lang="scss">
	.team {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.5rem;
	}

	.card {
		flex: 0 1 17rem;

		background: #fff;
		color: var(--color-900);
		border-radius: 1rem;
		padding: 1.75rem 1.25rem;

		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.75rem;

		box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.18);

		.avatar {
			width: 6.5rem;
			height: 6.5rem;
			border-radius: 999px;
			object-fit: cover;
			flex-shrink: 0;
			border: 3px solid var(--scv-red);
		}

		.avatar.placeholder {
			display: flex;
			align-items: center;
			justify-content: center;

			background: var(--color-50);
			border-style: dashed;
			border-color: var(--color-300);
			color: var(--color-300);

			iconify-icon {
				font-size: 2.5rem;
			}
		}

		.name {
			font-weight: 700;
			font-size: 1.15rem;
		}

		.role {
			font-size: 0.85rem;
			font-weight: 600;
			color: var(--scv-blue);
		}

		p {
			font-size: 0.82rem;
			line-height: 1.45;
			white-space: pre-wrap;
			color: var(--color-600);
		}
	}

	@media (max-width: 480px) {
		.card {
			flex-basis: 100%;
		}
	}

	.join {
		margin-top: clamp(2.5rem, 6vw, 4rem);

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		text-align: center;

		p {
			max-width: 44rem;
			line-height: 1.6;
		}

		.muted {
			opacity: 0.85;
			font-size: 0.95rem;
		}
	}

	/* bouton d'inscription : bien visible + mise en avant au clic sur "S'inscrire" */
	#inscription.big {
		font-size: 1.05rem;
		padding: 0.9rem 1.6rem;
		scroll-margin-top: 6rem;
	}

	#inscription.flash {
		animation: inscription-pulse 1.3s ease-out 2;
	}

	@keyframes inscription-pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.9);
			transform: scale(1);
		}
		40% {
			transform: scale(1.06);
		}
		70% {
			box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
			transform: scale(1);
		}
	}
</style>
