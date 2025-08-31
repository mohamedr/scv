<footer>
	<nav>
		<a href="#accueil">Accueil</a>
		<a href="#equipe">L'équipe</a>
		<a href="#horaires">Horaires</a>
		<a href="#contact">Contact</a>
	</nav>

	<div class="socials">
		<a href="https://instagram.com/sambo_club_vedasien_" target="_blank" rel="noopener">
			<iconify-icon icon="mdi:instagram"></iconify-icon> Instagram
		</a>
		<a href="https://facebook.com/SamboClubVedasien" target="_blank" rel="noopener">
			<iconify-icon icon="mdi:facebook"></iconify-icon> Facebook
		</a>
	</div>

	<p>&copy; 2025 PivoMed Design — Tous droits réservés.</p>

	<a href="#accueil" class="back-to-top" aria-label="Remonter en haut">↑</a>
</footer>

<style>
	footer {
		background-color: var(--scv-blue);
		padding: 2rem;
		color: white;
		text-align: center;
		position: relative;
	}

	footer nav {
		margin-bottom: 1rem;
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	footer nav a {
		color: white;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	footer nav a:hover {
		color: var(--scv-red);
	}

	.socials {
		margin-bottom: 1rem;
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.socials a {
		color: white;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 500;
		transition: color 0.2s;
	}

	.socials a:hover {
		color: var(--scv-red);
	}

	.back-to-top {
		position: absolute;
		right: 2rem;
		bottom: 2rem;
		background: var(--scv-red);
		color: white;
		padding: 0.5rem 0.75rem;
		border-radius: 50%;
		font-size: 1.25rem;
		text-decoration: none;
		transition: background 0.2s;
	}

	.back-to-top:hover {
		background: #b00020;
	}

	@media screen and (min-width: 768px) {
		footer {
			padding-inline: 20vw;
		}
	}
</style>
