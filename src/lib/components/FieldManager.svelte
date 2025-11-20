<script lang="ts">
  import {
    appState,
    addField,
    removeField,
    addNoteType,
    deleteNoteType,
    switchNoteType,
  } from "../stores/appState.svelte.js";

  let newFieldName = $state("");
  let newNoteTypeName = $state("");
  let isAddingNoteType = $state(false);

  function handleAdd() {
    if (newFieldName) {
      addField(newFieldName);
      newFieldName = "";
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") handleAdd();
  }

  function handleAddNoteType() {
    if (newNoteTypeName) {
      addNoteType(newNoteTypeName);
      newNoteTypeName = "";
      isAddingNoteType = false;
    }
  }

  let currentFields = $derived(
    appState.noteTypes.find((n) => n.name === appState.currentNoteTypeId)
      ?.fields || [],
  );
</script>

<div class="field-manager">
  <div class="note-type-section">
    <div class="header">Note Type</div>
    <div class="controls">
      <select
        value={appState.currentNoteTypeId}
        onchange={(e) => switchNoteType(e.currentTarget.value)}
      >
        {#each appState.noteTypes as nt}
          <option value={nt.name}>{nt.name}</option>
        {/each}
      </select>
      <button
        onclick={() => (isAddingNoteType = !isAddingNoteType)}
        title="Add Note Type">+</button
      >
      <button
        onclick={() => deleteNoteType(appState.currentNoteTypeId)}
        title="Delete Note Type"
        disabled={appState.noteTypes.length <= 1}>-</button
      >
    </div>

    {#if isAddingNoteType}
      <div class="add-note-type">
        <input
          type="text"
          placeholder="Note Type Name..."
          bind:value={newNoteTypeName}
          onkeydown={(e) => e.key === "Enter" && handleAddNoteType()}
        />
        <button onclick={handleAddNoteType}>Add</button>
      </div>
    {/if}
  </div>

  <div class="header">Fields</div>
  <div class="field-list">
    {#each currentFields as field}
      <div class="field-item">
        <div class="field-header">
          <span class="field-name">{field}</span>
          <button
            class="icon-btn"
            onclick={() => removeField(field)}
            title="Remove Field">×</button
          >
        </div>
        <textarea
          placeholder="Sample data for {field}..."
          bind:value={appState.sampleData[field]}
        ></textarea>
      </div>
    {/each}
  </div>
  <div class="add-field">
    <input
      type="text"
      placeholder="New field name..."
      bind:value={newFieldName}
      onkeydown={handleKeydown}
    />
    <button onclick={handleAdd}>+</button>
  </div>
</div>

<style>
  .field-manager {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #252526;
    border-right: 1px solid #333;
    width: 100%; /* Let SplitPane control width */
    flex-shrink: 0;
  }

  .note-type-section {
    border-bottom: 1px solid #444;
    padding-bottom: 0.5rem;
  }

  .controls {
    display: flex;
    padding: 0.5rem;
    gap: 0.5rem;
  }

  select {
    flex: 1;
    background: #1e1e1e;
    color: white;
    border: 1px solid #333;
    padding: 0.3rem;
  }

  .add-note-type {
    padding: 0.5rem;
    display: flex;
    gap: 0.5rem;
  }

  .header {
    padding: 0.5rem;
    font-weight: bold;
    background: #333;
    border-bottom: 1px solid #444;
    color: #eee;
  }

  .field-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .field-item {
    margin-bottom: 1rem;
    background: #1e1e1e;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #333;
  }

  .field-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.3rem;
  }

  .field-name {
    font-weight: 500;
    color: #ddd;
  }

  .icon-btn {
    background: none;
    border: none;
    color: #888;
    padding: 0 0.3rem;
    font-size: 1.2rem;
    line-height: 1;
  }

  .icon-btn:hover {
    color: #ff4444;
    background: none;
  }

  textarea {
    width: 100%;
    box-sizing: border-box;
    background: #2d2d2d;
    border: 1px solid #333;
    color: #ccc;
    padding: 0.3rem;
    font-size: 0.9rem;
    resize: vertical;
    min-height: 40px;
  }

  .add-field {
    padding: 0.5rem;
    border-top: 1px solid #333;
    display: flex;
    gap: 0.5rem;
  }

  input {
    flex: 1;
    background: #1e1e1e;
    border: 1px solid #333;
    color: white;
    padding: 0.3rem;
  }

  button {
    background: #333;
    border: 1px solid #444;
    color: #eee;
    cursor: pointer;
  }

  button:hover {
    background: #444;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
