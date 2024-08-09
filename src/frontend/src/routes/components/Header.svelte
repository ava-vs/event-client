<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/logo.png';
	import github from '$lib/images/github.svg';
	import { isLoading, handleNotifications } from '$lib/notification-store';
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
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li aria-current={$page.url.pathname.startsWith('/publication') ? 'page' : undefined}>
				<a href="/publication">Publication</a>
			</li>
			<li aria-current={$page.url.pathname.startsWith('/subscription') ? 'page' : undefined}>
				<a href="/subscription">Subscription</a>
			</li>
			<li aria-current={$page.url.pathname === '/dao' ? 'page' : undefined}>
				<a href="/dao">DAO</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		{#if $page.url.pathname === '/'}
			<button class="notification-button" on:click={$handleNotifications} disabled={$isLoading}>
				{$isLoading ? 'Loading...' : 'Reload'}
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
	}

	.corner {
		width: auto;
		height: 3em;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3em;
		height: 3em;
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

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
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

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
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

	a:hover {
		color: var(--color-theme-1);
	}

	.notification-button {
		background-color: #e2e2e2;
		border: none;
		color: white;
		padding: 10px 20px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 4px 2px;
		cursor: pointer;
		border-radius: 4px;
	}

	.notification-button:disabled {
		background-color: #cccccc;
		color: #f0f0f0;
		cursor: not-allowed;
	}

	@media (max-width: 640px) {
		nav a {
			font-size: 0.7rem;
			padding: 0 0.3rem;
		}

		.notification-button {
			max-width: 80px;
			height: 30px;
			line-height: 30px;
			font-size: 14px;
		}

		.corner img {
			width: 1.5em;
			height: 1.5em;
		}
	}

	@media (max-width: 480px) {
		nav a {
			font-size: 0.6rem;
			padding: 0 0.2rem;
		}

		.notification-button {
			max-width: 50px;
			height: 20px;
			line-height: 20px;
			font-size: 13px;
		}

		.corner img {
			width: 1.5em;
			height: 1.5em;
		}
	}
</style>
