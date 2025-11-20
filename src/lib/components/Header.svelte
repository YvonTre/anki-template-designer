<script lang="ts">
  interface Props {
    onExport: () => void;
  }
  let { onExport }: Props = $props();
</script>

<header>
  <div class="logo">
    <h1>Anki Template Designer</h1>
  </div>
  <div class="controls">
    <button class="primary" onclick={onExport}> Export </button>
  </div>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    height: 50px;
    background-color: #222;
    color: white;
    border-bottom: 1px solid #333;
  }

  h1 {
    font-size: 1.2rem;
    margin: 0;
    font-weight: 500;
  }

  .controls {
    display: flex;
    gap: 0.5rem;
  }

  button {
    background: #333;
    border: 1px solid #444;
    color: #eee;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s;
  }

  button:hover {
    background: #444;
  }

  button.primary {
    background: #007acc;
    border-color: #0062a3;
  }

  button.primary:hover {
    background: #008ae6;
  }
</style>
