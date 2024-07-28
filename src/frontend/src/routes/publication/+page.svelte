<script>
    import "../../index.scss";
    import NavMenu from "../Header.svelte";
    import PubForm from "./PubForm.svelte";
</script>

<main style="padding-top: 3em;">
    <NavMenu />
    <PubForm />
</main>

<style>
    main {
        justify-content: flex-start;
    }
</style>
