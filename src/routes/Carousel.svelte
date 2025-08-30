<script context="module">
	import img_001 from './images/carousel/001.jpeg';
	import img_002 from './images/carousel/002.jpeg';
	import img_003 from './images/carousel/003.jpeg';
	import img_004 from './images/carousel/004.jpeg';
	import img_005 from './images/carousel/005.jpeg';
	import img_006 from './images/carousel/006.jpeg';

	const images = [img_001, img_002, img_003, img_004, img_005, img_006];

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

		height: 75vh;

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
