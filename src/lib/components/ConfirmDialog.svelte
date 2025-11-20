<script lang="ts">
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
    confirmText = '确定',
    cancelText = '取消',
    onConfirm,
    onCancel,
  }: Props = $props();
</script>

{#if open}
  <div
    class="overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="confirm-title"
    onclick={onCancel}
    onkeydown={(e) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    }}
  >
    <div class="dialog" onclick={(e) => e.stopPropagation()}>
      <div class="header">
        <h2 id="confirm-title">{title}</h2>
      </div>
      <div class="content">
        <p>{message}</p>
      </div>
      <div class="actions">
        <button class="cancel-btn" onclick={onCancel}>{cancelText}</button>
        <button class="confirm-btn" onclick={onConfirm}>{confirmText}</button>
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

