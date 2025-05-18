<script context="module">
	const images = [
		'https://images.unsplash.com/photo-1743071441939-9ec2b3352b54?q=80&w=1889&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://images.unsplash.com/photo-1745179276969-d9db2e682b5d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://images.unsplash.com/photo-1745972036912-3e7ccc236922?q=80&w=1622&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://images.unsplash.com/photo-1745953129826-6ad01708cd65?q=80&w=1728&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://images.unsplash.com/photo-1746298286354-96f073eda38c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		'https://images.unsplash.com/photo-1747019131706-2fc573222f0e?q=80&w=1635&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
	];

	/**
	 * @param {HTMLElement} node
	 */
	function scroll(node) {
		let index = 1;

		const interval = setInterval(() => {
			const target = node.children[index++ % node.children.length].getBoundingClientRect();
			const rect = node.getBoundingClientRect();

			node.scrollTo({
				left: target.x - rect.x + node.scrollLeft,
				behavior: 'smooth'
			});
		}, 5000);

		return {
			destroy() {
				clearInterval(interval);
			}
		};
	}
</script>

<div class="carousel" use:scroll>
	{#each images as src}
		<img {src} />
	{/each}
</div>

<style>
	.carousel {
		display: flex;

		overflow: auto;
		scroll-snap-type: x mandatory;

		height: 100%;

		img {
			height: 100%;
			width: 100dvw;
			flex-shrink: 0;

			object-fit: cover;
			background-color: black;
			scroll-snap-align: center;
		}
	}
</style>
