<script>
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<main>
	<h1>Contact</h1>

	{#if form?.success}
		<p>Merci!</p>
	{:else}
		<form method="POST" action="?/sendEmail" use:enhance>
			<input type="text" placeholder="Nom" name="lastname" />
			<input type="text" placeholder="Prénom" name="firstname" />
			<input type="text" placeholder="Sujet" name="subject" />
			<textarea cols="12" placeholder="Message" name="message"></textarea>
			<button type="submit">
				<iconify-icon icon="fa6-solid:paper-plane"></iconify-icon>
				Envoyer
			</button>
		</form>
	{/if}
</main>

<style>
	h1 {
		margin-bottom: 1rem;
	}

	main {
		padding: 4rem;
	}

	form {
		display: grid;
		gap: 1rem;
		grid-template-areas:
			'lastname firstname'
			'subject subject'
			'message message'
			'submit submit';
	}

	[name='firstname'] {
		grid-area: firstname;
	}

	[name='lastname'] {
		grid-area: lastname;
	}

	[name='subject'] {
		grid-area: subject;
	}

	[name='message'] {
		grid-area: message;
	}

	button[type='submit'] {
		grid-area: submit;
	}
</style>
