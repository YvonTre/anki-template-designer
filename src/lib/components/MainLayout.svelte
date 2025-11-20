<script lang="ts">
  import Header from "./Header.svelte";
  import SplitPane from "./SplitPane.svelte";
  import FieldManager from "./FieldManager.svelte";
  import EditorPane from "./EditorPane.svelte";
  import PreviewPane from "./PreviewPane.svelte";
  import Toast from "./Toast.svelte";
  import { appState } from "../stores/appState.svelte.js";
  import { locale as localeStore, translate, getLocale } from "../i18n.js";

  let currentLocale = $state(getLocale());
  $effect(() => {
    const unsubscribe = localeStore.subscribe((value) => {
      currentLocale = value;
    });
    return () => unsubscribe();
  });
  const t = (key: string) => translate(currentLocale, key);

  function handleExport() {
    // Create a text content with the template data
    const content = `
${t("export.frontLabel")}
${appState.templates.front}

${t("export.backLabel")}
${appState.templates.back}

${t("export.cssLabel")}
${appState.templates.css}
    `.trim();

    // Create a blob and download
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = t("export.fileName");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
</script>

<div class="app-container">
  <Header onExport={handleExport} />

  <div class="main-content">
    <SplitPane direction="horizontal" initialSize={20}>
      {#snippet pane1()}
        <FieldManager />
      {/snippet}

      {#snippet pane2()}
        <SplitPane direction="horizontal" initialSize={50}>
          {#snippet pane1()}
            <EditorPane />
          {/snippet}

          {#snippet pane2()}
            <PreviewPane />
          {/snippet}
        </SplitPane>
      {/snippet}
    </SplitPane>
  </div>
</div>

<Toast />

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    background: #1e1e1e;
    color: #ccc;
    overflow: hidden;
  }

  .main-content {
    flex: 1;
    overflow: hidden;
    position: relative;
    display: flex; /* Ensure SplitPane fills it */
  }
</style>
