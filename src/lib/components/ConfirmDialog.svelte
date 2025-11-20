<script lang="ts">
  import { tick } from 'svelte';
  import { locale as localeStore, translate, getLocale } from '../i18n.js';
  interface Props {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
  }

  let {
    open,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
  }: Props = $props();

  let dialogRef = $state<HTMLDivElement | null>(null);
  let currentLocale = $state(getLocale());
  $effect(() => {
    const unsubscribe = localeStore.subscribe((value) => {
      currentLocale = value;
    });
    return () => unsubscribe();
  });
  const t = (key: string) => translate(currentLocale, key);
  let resolvedConfirmText = $derived.by(() => confirmText ?? t('common.buttons.confirm'));
  let resolvedCancelText = $derived.by(() => cancelText ?? t('common.buttons.cancel'));

  $effect(() => {
    if (!open) return;
    (async () => {
      await tick();
      dialogRef?.focus();
    })();
  });

  function handleOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  }

  function handleOverlayKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onCancel();
    }
  }

  function handleDialogKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      onConfirm();
    }
  }
</script>

{#if open}
  <div
    class="overlay"
    role="button"
    aria-label={t('confirmDialog.overlayAria')}
    tabindex="0"
    onclick={handleOverlayClick}
    onkeydown={handleOverlayKeydown}
  >
    <div
      class="dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      tabindex="-1"
      bind:this={dialogRef}
      onkeydown={handleDialogKeydown}
    >
      <div class="header">
        <h2 id="confirm-title">{title}</h2>
      </div>
      <div class="content">
        <p>{message}</p>
      </div>
      <div class="actions">
        <button class="cancel-btn" onclick={onCancel}>{resolvedCancelText}</button>
        <button class="confirm-btn" onclick={onConfirm}>{resolvedConfirmText}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }

  .dialog {
    background: #252526;
    border: 1px solid #444;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .header {
    padding: 1rem;
    border-bottom: 1px solid #444;
  }

  .header h2 {
    margin: 0;
    font-size: 1.1rem;
    color: #eee;
  }

  .content {
    padding: 1.5rem;
  }

  .content p {
    margin: 0;
    color: #ccc;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    padding: 1rem;
    border-top: 1px solid #444;
  }

  .cancel-btn,
  .confirm-btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: 1px solid #444;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .cancel-btn {
    background: #333;
    color: #eee;
  }

  .cancel-btn:hover {
    background: #444;
  }

  .confirm-btn {
    background: #d32f2f;
    border-color: #b71c1c;
    color: white;
  }

  .confirm-btn:hover {
    background: #f44336;
  }
</style>

