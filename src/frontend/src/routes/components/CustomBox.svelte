<!-- CustomBox.svelte -->
<script>
	export let mt = 0;
</script>

<div style="margin-top: {mt * 8}px;">
	<slot></slot>
</div>
