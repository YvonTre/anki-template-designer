<script lang="ts">
  import { createNewTemplate } from '../stores/appState.svelte.js';
  import * as Toast from '../stores/toast.svelte.js';

  interface Props {
    open: boolean;
    onClose: () => void;
    initialName?: string;
  }

  let { open, onClose, initialName = '' }: Props = $props();

  let templateName = $state(initialName);
  let creating = $state(false);

  $effect(() => {
    if (open) {
      templateName = initialName || '';
    }
  });

  async function handleCreate() {
    if (!templateName.trim()) {
      Toast.error('请输入模板名称');
      return;
    }

    creating = true;
    try {
      await createNewTemplate(templateName.trim());
      templateName = '';
      Toast.success('模板创建成功');
      onClose();
    } catch (error) {
      console.error('Failed to create template:', error);
      Toast.error('创建失败');
    } finally {
      creating = false;
    }
  }
</script>

{#if open}
  <div
    class="overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="dialog-title"
    onclick={onClose}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
  >
    <div class="dialog" onclick={(e) => e.stopPropagation()}>
      <div class="header">
        <h2 id="dialog-title">新建模板</h2>
        <button class="close-btn" onclick={onClose} aria-label="关闭">×</button>
      </div>

      <div class="content">
        <p class="description">创建一个新模板，当前的所有设置将被保存。</p>
        <div class="input-group">
          <label for="template-name">模板名称</label>
          <input
            id="template-name"
            type="text"
            placeholder="输入模板名称..."
            bind:value={templateName}
            onkeydown={(e) => e.key === 'Enter' && handleCreate()}
            disabled={creating}
            autofocus
          />
        </div>
        <div class="actions">
          <button class="create-btn" onclick={handleCreate} disabled={creating || !templateName.trim()}>
            {creating ? '创建中...' : '创建'}
          </button>
          <button class="cancel-btn" onclick={onClose} disabled={creating}>
            取消
          </button>
        </div>
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
    z-index: 1000;
  }

  .dialog {
    background: #252526;
    border: 1px solid #444;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #444;
  }

  .header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #eee;
  }

  .close-btn {
    background: none;
    border: none;
    color: #999;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    color: #eee;
    background: #333;
    border-radius: 4px;
  }

  .content {
    padding: 1.5rem;
  }

  .description {
    color: #ccc;
    margin: 0 0 1rem 0;
    font-size: 0.9rem;
  }

  .input-group {
    margin-bottom: 1.5rem;
  }

  .input-group label {
    display: block;
    color: #eee;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .input-group input {
    width: 100%;
    background: #1e1e1e;
    border: 1px solid #444;
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
    box-sizing: border-box;
  }

  .input-group input:focus {
    outline: none;
    border-color: #007acc;
  }

  .input-group input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  .create-btn,
  .cancel-btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: 1px solid #444;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .create-btn {
    background: #007acc;
    border-color: #0062a3;
    color: white;
  }

  .create-btn:hover:not(:disabled) {
    background: #008ae6;
  }

  .create-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .cancel-btn {
    background: #333;
    color: #eee;
  }

  .cancel-btn:hover:not(:disabled) {
    background: #444;
  }

  .cancel-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>

