<script lang="ts">
  import { storage, type SavedTemplate } from '../utils/storage.js';
  import { loadFromStorage } from '../stores/appState.svelte.js';
  import * as Toast from '../stores/toast.svelte.js';
  import ConfirmDialog from './ConfirmDialog.svelte';

  interface Props {
    open: boolean;
    onClose: () => void;
  }

  let { open, onClose }: Props = $props();

  let templates = $state<SavedTemplate[]>([]);
  let isLoading = $state(false);
  let deletingId: string | null = $state(null);
  let showConfirmDelete = $state(false);
  let pendingDeleteId: string | null = $state(null);

  $effect(() => {
    if (open) {
      loadTemplates();
    }
  });

  async function loadTemplates() {
    isLoading = true;
    try {
      templates = await storage.getAllTemplates();
    } catch (error) {
      console.error('Failed to load templates:', error);
      Toast.error('加载模板列表失败');
    } finally {
      isLoading = false;
    }
  }

  async function handleLoad(id: string) {
    try {
      await loadFromStorage(id);
      Toast.success('模板加载成功');
      onClose();
    } catch (error) {
      console.error('Failed to load:', error);
      Toast.error('加载失败');
    }
  }

  function handleDeleteClick(id: string, e: Event) {
    e.stopPropagation();
    pendingDeleteId = id;
    showConfirmDelete = true;
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return;

    deletingId = pendingDeleteId;
    showConfirmDelete = false;
    
    try {
      await storage.deleteTemplate(pendingDeleteId);
      Toast.success('模板删除成功');
      await loadTemplates();
    } catch (error) {
      console.error('Failed to delete:', error);
      Toast.error('删除失败');
    } finally {
      deletingId = null;
      pendingDeleteId = null;
    }
  }

  function cancelDelete() {
    showConfirmDelete = false;
    pendingDeleteId = null;
  }

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <h2 id="dialog-title">加载模板</h2>
        <button class="close-btn" onclick={onClose} aria-label="关闭">×</button>
      </div>

      <div class="content">
        <div class="templates-list">
          {#if isLoading}
            <div class="loading">加载中...</div>
          {:else if templates.length === 0}
            <div class="empty">暂无保存的模板</div>
          {:else}
            <div class="template-items">
              {#each templates as template}
                <div
                  class="template-item"
                  role="button"
                  tabindex="0"
                  onclick={() => handleLoad(template.id)}
                  onkeydown={(e) => e.key === 'Enter' && handleLoad(template.id)}
                >
                  <div class="template-info">
                    <div class="template-name">{template.name}</div>
                    <div class="template-meta">
                      更新于 {formatDate(template.updatedAt)}
                    </div>
                  </div>
                  <button
                    class="delete-btn"
                    onclick={(e) => handleDeleteClick(template.id, e)}
                    disabled={deletingId === template.id}
                  >
                    {deletingId === template.id ? '删除中...' : '删除'}
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<ConfirmDialog
  open={showConfirmDelete}
  title="删除模板"
  message="确定要删除这个模板吗？此操作无法撤销。"
  confirmText="删除"
  cancelText="取消"
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
/>

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
    max-width: 600px;
    max-height: 80vh;
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
    padding: 1rem;
    overflow-y: auto;
    flex: 1;
  }

  .loading,
  .empty {
    text-align: center;
    padding: 2rem;
    color: #999;
  }

  .template-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .template-item {
    background: #1e1e1e;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: background 0.2s;
  }

  .template-item:hover {
    background: #2d2d2d;
    border-color: #444;
  }

  .template-info {
    flex: 1;
  }

  .template-name {
    font-weight: 500;
    color: #eee;
    margin-bottom: 0.25rem;
  }

  .template-meta {
    font-size: 0.85rem;
    color: #999;
  }

  .delete-btn {
    background: #d32f2f;
    border: 1px solid #b71c1c;
    color: white;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
  }

  .delete-btn:hover:not(:disabled) {
    background: #f44336;
  }

  .delete-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>

