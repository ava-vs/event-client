<script>
	import { page } from "$app/stores";
	import logo from "$lib/images/logo.png";
	import github from "$lib/images/github.svg";
	import { isLoading, handleNotifications } from "$lib/notification-store";
</script>

<header>
	<div class="corner">
		<a href="https://ava.capetown/en" target="_blank">
			<img src={logo} alt="aVa Home" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={$page.url.pathname === "/" ? "page" : undefined}>
				<a href="/">Home</a>
			</li>
			<li
				aria-current={$page.url.pathname.startsWith("/publication")
					? "page"
					: undefined}
			>
				<a href="/publication">Publish</a>
			</li>
			<li
				aria-current={$page.url.pathname.startsWith("/subscription")
					? "page"
					: undefined}
			>
				<a href="/subscription">Subscribe</a>
			</li>
			<li
				aria-current={$page.url.pathname === "/dao"
					? "page"
					: undefined}
			>
				<a href="/dao">DAO</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner right">
		{#if $page.url.pathname === "/"}
			<button
				class="icon-button"
				on:click={$handleNotifications}
				disabled={$isLoading}
				aria-label="Reload notifications"
			>
				<svg
					class={$isLoading ? "spin" : ""}
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
					/>
				</svg>
			</button>
		{/if}
		<a href="https://github.com/ava-vs/att-dao-app" target="_blank">
			<img src={github} alt="GitHub" />
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 1rem;
	}

	.corner {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3em;
		height: 3em;
	}

	.right {
		margin-right: 1rem;
		justify-content: flex-end;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2em;
		height: 2em;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	li[aria-current="page"]::before {
		--size: 6px;
		content: "";
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	.icon-button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25em;
		color: var(--color-text);
		transition: color 0.2s linear;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon-button:hover {
		color: var(--color-theme-1);
	}

	.icon-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.icon-button svg {
		width: 20px;
		height: 20px;
	}

	.spin {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		100% {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 640px) {
		.icon-button {
			padding: 0.15em;
		}

		.icon-button svg {
			width: 18px;
			height: 18px;
		}
	}
</style>
