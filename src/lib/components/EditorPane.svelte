<script lang="ts">
  import { appState, triggerTemplateChange } from "../stores/appState.svelte.js";
  import SplitPane from "./SplitPane.svelte";
  import CodeMirrorEditor from "./CodeMirrorEditor.svelte";
</script>

<SplitPane direction="vertical" initialSize={33}>
  {#snippet pane1()}
    <div class="editor-container">
      <div class="editor-header">Front Template</div>
      <CodeMirrorEditor
        bind:value={appState.templates.front}
        language="html"
        placeholder="Front Template HTML..."
        onInput={triggerTemplateChange}
      />
    </div>
  {/snippet}
  {#snippet pane2()}
    <SplitPane direction="vertical" initialSize={50}>
      {#snippet pane1()}
        <div class="editor-container">
          <div class="editor-header">Back Template</div>
          <CodeMirrorEditor
            bind:value={appState.templates.back}
            language="html"
            placeholder="Back Template HTML..."
            onInput={triggerTemplateChange}
          />
        </div>
      {/snippet}
      {#snippet pane2()}
        <div class="editor-container">
          <div class="editor-header">Styling (CSS)</div>
          <CodeMirrorEditor
            bind:value={appState.templates.css}
            language="css"
            placeholder="CSS..."
            onInput={triggerTemplateChange}
          />
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

  /* CodeMirror editor handles styles automatically */
</style>
