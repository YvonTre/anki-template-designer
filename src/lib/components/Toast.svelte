<script lang="ts">
  import { getToasts, removeToast } from '../stores/toast.svelte.js';

  let toasts = $derived(getToasts());
</script>

<div class="toast-container">
  {#each toasts as toast}
    <div class="toast toast-{toast.type}" role="alert">
      <span class="toast-message">{toast.message}</span>
      <button class="toast-close" onclick={() => removeToast(toast.id)} aria-label="关闭">×</button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    pointer-events: none;
  }

  .toast {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    min-width: 250px;
    max-width: 400px;
    pointer-events: auto;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .toast-success {
    background: #4caf50;
    color: white;
  }

  .toast-error {
    background: #f44336;
    color: white;
  }

  .toast-info {
    background: #2196f3;
    color: white;
  }

  .toast-message {
    flex: 1;
    font-size: 0.9rem;
  }

  .toast-close {
    background: none;
    border: none;
    color: inherit;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .toast-close:hover {
    opacity: 1;
  }
</style>

