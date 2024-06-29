<script>
    import connector from "$lib/images/Connector.svg";

    let subscriber = "mlss5-5qaaa...";
    let namespace = "test.ava.event";
    let filter = "Filter 1";

    function handleSubmit() {
        console.log("Submitted:", { subscriber, namespace, filter });
        // Здесь будет логика отправки формы
    }
</script>

<div class="subscription-form">
    <div class="input-group">
        <label for="subscriber">Subscriber</label>
        <input type="text" id="subscriber" bind:value={subscriber} />
    </div>
    <div class="connector">
        <img src={connector} alt="connector" />
    </div>
    <div class="input-group">
        <label for="namespace">Namespace</label>
        <input type="text" id="namespace" bind:value={namespace} />
    </div>
    <div class="connector">
        <img src={connector} alt="connector" />
    </div>
    <div class="input-group">
        <label for="filter">Filter</label>
        <input type="text" id="filter" bind:value={filter} />
    </div>
    <button on:click={handleSubmit}>Submit</button>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Krona+One&display=swap");

    .subscription-form {
        font-family: "Krona One", Arial, sans-serif;
        max-width: 300px;
        margin: 0 auto;
        padding: 20px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .input-group {
        position: relative;
        margin-bottom: 10px;
    }

    label {
        position: absolute;
        left: 10px;
        top: -10px;
        background-color: white;
        padding: 0 5px;
        font-size: 12px;
        color: #666;
        z-index: 1;
    }

    input {
        width: 100%;
        padding: 10px;
        border: 2px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
    }

    input:focus {
        outline: none;
        border-color: #2196f3;
    }

    .connector {
        /* height: 30px; */
        display: flex;
        justify-content: center;
        align-items: center;
        margin: -5px 0;
    }

    .connector img {
        height: 100%;
        width: 100%;
    }

    button {
        width: 100%;
        padding: 10px;
        background-color: #2196f3;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
        margin-top: 10px;
    }

    button:hover {
        background-color: #1976d2;
    }
</style>
