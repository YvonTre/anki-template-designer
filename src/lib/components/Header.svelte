<script lang="ts">
  import LoadDialog from './LoadDialog.svelte';
  import NewTemplateDialog from './NewTemplateDialog.svelte';
  import { appState, saveCurrentTemplate, clearCurrentTemplate, saveState, autoSaveState, getHasUnsavedChanges } from '../stores/appState.svelte.js';
  import IconSpinner from '~icons/svg-spinners/ring-resize';
  import IconCheck from '~icons/mdi/check';
  import IconError from '~icons/mdi/alert-circle';
  import { locale as localeStore, translate, getLocale } from '../i18n.js';

  interface Props {
    onExport: () => void;
  }
  let { onExport }: Props = $props();

  let showLoadDialog = $state(false);
  let showNewDialog = $state(false);

  async function handleSave() {
    if (!appState.currentTemplateId) {
      // If no template is associated, show new template dialog
      showNewDialog = true;
      return;
    }

    try {
      await saveCurrentTemplate();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  }

  function handleNew() {
    // Clear current template to start fresh
    clearCurrentTemplate();
    showNewDialog = true;
  }

  let saveStatus = $derived(saveState.status);
  let autoSaveStatus = $derived(autoSaveState.status);
  let isSaving = $derived(saveState.isSaving);
  let isAutoSaving = $derived(autoSaveState.isSaving);
  let hasUnsavedChanges = $derived(getHasUnsavedChanges());
  let currentLocale = $state(getLocale());
  $effect(() => {
    const unsubscribe = localeStore.subscribe((value) => {
      currentLocale = value;
    });
    return () => unsubscribe();
  });

  const t = (key: string) => translate(currentLocale, key);
</script>

<header>
  <div class="logo">
    <h1>{t('header.title')}</h1>
    {#if appState.currentTemplateId && appState.currentTemplateName}
      <span class="template-indicator">{appState.currentTemplateName}</span>
      {#if hasUnsavedChanges}
        <span class="template-indicator unsaved">{t('common.unsaved')}</span>
      {/if}
    {:else}
      <span class="template-indicator unsaved">{t('common.unsaved')}</span>
    {/if}
    {#if appState.currentTemplateId && (saveStatus !== 'idle' || autoSaveStatus !== 'idle')}
      <div class="save-status">
        {#if isSaving}
          <span class="spinner" aria-hidden="true">
            <IconSpinner />
          </span>
          <span>{t('common.status.saving')}</span>
        {:else if isAutoSaving}
          <span class="spinner" aria-hidden="true">
            <IconSpinner />
          </span>
          <span>{t('common.status.autoSaving')}</span>
        {:else if saveStatus === 'saved'}
          <span class="check-icon" aria-hidden="true">
            <IconCheck />
          </span>
          <span>{t('common.status.saved')}</span>
        {:else if autoSaveStatus === 'saved'}
          <span class="check-icon" aria-hidden="true">
            <IconCheck />
          </span>
          <span>{t('common.status.autoSaved')}</span>
        {:else if saveStatus === 'error' || autoSaveStatus === 'error'}
          <span class="error-icon" aria-hidden="true">
            <IconError />
          </span>
          <span>{t('common.status.error')}</span>
        {/if}
      </div>
    {/if}
  </div>
  <div class="controls">
    <button onclick={handleNew}>➕ {t('common.buttons.new')}</button>
    <button onclick={handleSave} disabled={isSaving}>
      {#if isSaving}
        <span class="spinner" aria-hidden="true">
          <IconSpinner />
        </span>
      {/if}
      <span>💾 {t('common.buttons.save')}</span>
    </button>
    <button onclick={() => (showLoadDialog = true)}>📂 {t('common.buttons.load')}</button>
    <button class="primary" onclick={onExport}>{t('common.buttons.export')}</button>
  </div>
</header>

<LoadDialog
  open={showLoadDialog}
  onClose={() => (showLoadDialog = false)}
/>

<NewTemplateDialog
  open={showNewDialog}
  onClose={() => (showNewDialog = false)}
  initialName=""
/>

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

  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  h1 {
    font-size: 1.2rem;
    margin: 0;
    font-weight: 500;
  }

  .template-indicator {
    font-size: 0.75rem;
    color: #4caf50;
    padding: 0.2rem 0.5rem;
    background: rgba(76, 175, 80, 0.2);
    border-radius: 4px;
  }

  .template-indicator.unsaved {
    color: #ff9800;
    background: rgba(255, 152, 0, 0.2);
  }

  .save-status {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: #ccc;
    padding: 0.2rem 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  .save-status .spinner {
    width: 12px;
    height: 12px;
    animation: spin 1s linear infinite;
  }

  .save-status .check-icon {
    width: 14px;
    height: 14px;
    color: #4caf50;
  }

  .save-status .error-icon {
    width: 14px;
    height: 14px;
    color: #f44336;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
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
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  button:hover:not(:disabled) {
    background: #444;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  button .spinner {
    width: 14px;
    height: 14px;
    animation: spin 1s linear infinite;
  }

  .spinner,
  .check-icon,
  .error-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .spinner :global(svg),
  .check-icon :global(svg),
  .error-icon :global(svg) {
    width: 100%;
    height: 100%;
  }

  button.primary {
    background: #007acc;
    border-color: #0062a3;
  }

  button.primary:hover {
    background: #008ae6;
  }
</style>
