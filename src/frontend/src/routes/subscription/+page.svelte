<script>
    import "../../index.scss";
    import NavMenu from "../Header.svelte";
    import SubForm from "./SubscriptionForm.svelte";
</script>

<main style="padding-top: 3em;">
    <NavMenu />
    <SubForm />
</main>

<style>
    main {
        justify-content: flex-start;
    }
</style>
