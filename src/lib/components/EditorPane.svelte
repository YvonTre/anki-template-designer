<script lang="ts">
  import { appState, triggerTemplateChange } from "../stores/appState.svelte.js";
  import SplitPane from "./SplitPane.svelte";
</script>

<SplitPane direction="vertical" initialSize={33}>
  {#snippet pane1()}
    <div class="editor-container">
      <div class="editor-header">Front Template</div>
      <textarea
        bind:value={appState.templates.front}
        placeholder="Front Template HTML..."
        oninput={triggerTemplateChange}
      ></textarea>
    </div>
  {/snippet}
  {#snippet pane2()}
    <SplitPane direction="vertical" initialSize={50}>
      {#snippet pane1()}
        <div class="editor-container">
          <div class="editor-header">Back Template</div>
      <textarea
        bind:value={appState.templates.back}
        placeholder="Back Template HTML..."
        oninput={triggerTemplateChange}
      ></textarea>
        </div>
      {/snippet}
      {#snippet pane2()}
        <div class="editor-container">
          <div class="editor-header">Styling (CSS)</div>
          <textarea
            bind:value={appState.templates.css}
            placeholder="CSS..."
            oninput={triggerTemplateChange}
          ></textarea>
        </div>
      {/snippet}
    </SplitPane>
  {/snippet}
</SplitPane>

<style>
  .editor-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #1e1e1e;
  }

  .editor-header {
    padding: 0.5rem;
    background: #252526;
    font-size: 0.8rem;
    text-transform: uppercase;
    color: #aaa;
    border-bottom: 1px solid #333;
  }

  textarea {
    flex: 1;
    background: #1e1e1e;
    color: #d4d4d4;
    border: none;
    padding: 1rem;
    resize: none;
    font-family: monospace;
    outline: none;
    white-space: pre;
  }
</style>
