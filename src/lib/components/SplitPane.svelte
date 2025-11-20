<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    pane1: Snippet;
    pane2: Snippet;
    direction?: "horizontal" | "vertical";
    initialSize?: number;
  }

  let {
    pane1,
    pane2,
    direction = "horizontal",
    initialSize = 50,
  }: Props = $props();

  let container: HTMLDivElement;
  let isDragging = false;
  let size = $state(initialSize);

  function startDrag() {
    isDragging = true;
    document.body.style.cursor =
      direction === "horizontal" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";

    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
  }

  function onDrag(e: MouseEvent) {
    if (!isDragging || !container) return;

    const rect = container.getBoundingClientRect();
    if (direction === "horizontal") {
      const x = e.clientX - rect.left;
      size = Math.max(10, Math.min(90, (x / rect.width) * 100));
    } else {
      const y = e.clientY - rect.top;
      size = Math.max(10, Math.min(90, (y / rect.height) * 100));
    }
  }

  function stopDrag() {
    isDragging = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", stopDrag);
  }
</script>

<div bind:this={container} class="split-pane {direction}">
  <div class="pane first" style="flex-basis: {size}%">
    {@render pane1()}
  </div>

  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="resizer"
    onmousedown={startDrag}
    role="separator"
    tabindex="0"
    aria-label="Resize split pane"
  ></div>

  <div class="pane second" style="flex-basis: {100 - size}%">
    {@render pane2()}
  </div>
</div>

<style>
  .split-pane {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .split-pane.horizontal {
    flex-direction: row;
  }

  .split-pane.vertical {
    flex-direction: column;
  }

  .pane {
    overflow: hidden; /* Changed from auto to hidden to let children handle scroll if needed, or auto */
    min-width: 0;
    min-height: 0;
    display: flex; /* Ensure children fill the pane */
    flex-direction: column;
  }

  /* Ensure the content inside pane fills it */
  .pane > :global(*) {
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .resizer {
    background-color: #333;
    z-index: 10;
    flex-shrink: 0;
    transition: background-color 0.2s;
    position: relative;
  }

  .resizer:hover,
  .resizer:active {
    background-color: #007acc;
  }

  /* Add a larger hit area for the resizer */
  .resizer::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  .horizontal > .resizer {
    width: 4px;
    cursor: col-resize;
  }

  .horizontal > .resizer::after {
    left: -4px;
    right: -4px;
  }

  .vertical > .resizer {
    height: 4px;
    cursor: row-resize;
  }

  .vertical > .resizer::after {
    top: -4px;
    bottom: -4px;
  }
</style>
