<script lang="ts">
  interface Props {
    value: string;
    placeholder?: string;
    onInput?: (value: string) => void;
  }

  let {
    value = $bindable(''),
    placeholder = '',
    onInput,
  }: Props = $props();

  function handleInput(event: Event) {
    const target = event.currentTarget as HTMLTextAreaElement;
    const updatedValue = target.value;
    value = updatedValue;
    onInput?.(updatedValue);
  }
</script>

<div class="codemirror-wrapper">
  <textarea
    class="fallback-textarea"
    bind:value={value}
    placeholder={placeholder}
    on:input={handleInput}
  />
</div>

<style>
  .codemirror-wrapper {
    flex: 1;
    height: 100%;
    overflow: hidden;
    background: #1e1e1e;
  }

  .fallback-textarea {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    resize: none;
    background: #1e1e1e;
    color: #fff;
    font-family: monospace;
    font-size: 14px;
    padding: 1rem;
    box-sizing: border-box;
  }
</style>

