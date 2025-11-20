<script lang="ts">
  import { appState, triggerTemplateChange } from "../stores/appState.svelte.js";
  import SplitPane from "./SplitPane.svelte";
  import CodeMirrorEditor from "./CodeMirrorEditor.svelte";
  import { locale as localeStore, translate, getLocale } from "../i18n.js";

  let currentLocale = $state(getLocale());
  $effect(() => {
    const unsubscribe = localeStore.subscribe((value) => {
      currentLocale = value;
    });
    return () => unsubscribe();
  });
  const t = (key: string) => translate(currentLocale, key);
</script>

<SplitPane direction="vertical" initialSize={33}>
  {#snippet pane1()}
    <div class="editor-container">
      <div class="editor-header">{t("editorPane.front")}</div>
      <CodeMirrorEditor
        bind:value={appState.templates.front}
        language="html"
        placeholder={t("common.placeholders.frontHtml")}
        onInput={triggerTemplateChange}
      />
    </div>
  {/snippet}
  {#snippet pane2()}
    <SplitPane direction="vertical" initialSize={50}>
      {#snippet pane1()}
        <div class="editor-container">
          <div class="editor-header">{t("editorPane.back")}</div>
          <CodeMirrorEditor
            bind:value={appState.templates.back}
            language="html"
            placeholder={t("common.placeholders.backHtml")}
            onInput={triggerTemplateChange}
          />
        </div>
      {/snippet}
      {#snippet pane2()}
        <div class="editor-container">
          <div class="editor-header">{t("editorPane.css")}</div>
          <CodeMirrorEditor
            bind:value={appState.templates.css}
            language="css"
            placeholder={t("common.placeholders.css")}
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
