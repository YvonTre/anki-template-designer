<script lang="ts">
  import LegacyTextareaEditor from './LegacyTextareaEditor.svelte';

  type Language = 'html' | 'css';

  interface Props {
    value: string;
    language: Language;
    placeholder?: string;
    onInput?: (value: string) => void;
  }

  let {
    value = $bindable(''),
    language = 'html',
    placeholder = '',
    onInput,
  }: Props = $props();

  const isClient = typeof window !== 'undefined';
  const codeMirrorModulePromise = isClient
    ? import('./CodeMirrorEditorImpl.svelte')
    : null;
</script>

{#if codeMirrorModulePromise}
  {#await codeMirrorModulePromise}
    <LegacyTextareaEditor
      bind:value
      {placeholder}
      {onInput}
    />
  {:then Module}
    {@const CodeMirror = Module.default}
    <CodeMirror
      bind:value
      {language}
      {placeholder}
      {onInput}
    />
  {:catch}
    <LegacyTextareaEditor
      bind:value
      {placeholder}
      {onInput}
    />
  {/await}
{:else}
  <LegacyTextareaEditor
    bind:value
    {placeholder}
    {onInput}
  />
{/if}
