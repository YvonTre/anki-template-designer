<script lang="ts">
  import { appState } from "../stores/appState.svelte.js";

  // Simple template renderer
  function renderTemplate(template: string, fields: Record<string, string>) {
    let rendered = template;

    // Helper to check if text contains HTML tags
    const hasHtml = (text: string) => /<[a-z][\s\S]*>/i.test(text);

    // Handle Cloze: {{cloze:Field}}
    // Simple regex to match {{cloze:FieldName}}
    const clozeRegex = /{{cloze:([^}]+)}}/g;
    rendered = rendered.replace(clozeRegex, (_, fieldName) => {
      const rawContent = fields[fieldName] || "";
      const isHtml = hasHtml(rawContent);

      // 1. Apply Cloze Replacement
      // Replace {{c1::Answer::Hint}} with <span class="cloze">[...]</span> or Answer
      // For now, let's just render it as the answer in bold/blue (simulating active cloze or just revealed)
      // Anki has complex logic for c1, c2 etc.
      // Let's just replace {{c\d+::(.*?)(::.*?)?}} with <span class="cloze">$1</span>
      let content = rawContent.replace(
        /{{c\d+::(.*?)(::.*?)?}}/g,
        '<span class="cloze">$1</span>',
      );

      // 2. Handle Newlines (if original content was plain text)
      if (!isHtml) {
        content = content.replace(/\n/g, "<br>");
      }

      return content;
    });

    // Replace {{Field}}
    for (const [key, value] of Object.entries(fields)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      rendered = rendered.replace(regex, () => {
        const rawContent = value || "";
        const isHtml = hasHtml(rawContent);
        let content = rawContent;

        if (!isHtml) {
          content = content.replace(/\n/g, "<br>");
        }
        return content;
      });
    }

    // Handle {{FrontSide}} special field (if not already handled)
    // In this simple implementation, we rely on the caller to handle FrontSide logic or recursive calls.

    return rendered;
  }

  let activeTab = $state<"front" | "back">("front");

  let frontHtml = $derived.by(() => {
    return renderTemplate(appState.templates.front, appState.sampleData);
  });

  let backHtml = $derived.by(() => {
    let html = appState.templates.back;
    // Replace {{FrontSide}} with the rendered front
    html = html.replace(/{{FrontSide}}/g, frontHtml);
    return renderTemplate(html, appState.sampleData);
  });

  let css = $derived(appState.templates.css);
  let isNight = $derived(appState.ui.isNight);
  let isMobile = $derived(appState.ui.isMobile);

  function toggleMobile() {
    appState.ui.isMobile = !appState.ui.isMobile;
  }

  function toggleNight() {
    appState.ui.isNight = !appState.ui.isNight;
  }

  let iframe: HTMLIFrameElement;

  $effect(() => {
    if (!iframe?.contentDocument) return;

    const doc = iframe.contentDocument;
    const htmlContent = activeTab === "front" ? frontHtml : backHtml;
    const nightClass = isNight ? "night" : "";

    // Initialize structure if empty
    if (!doc.getElementById("anki-styles")) {
      doc.head.innerHTML = `<style id="anki-styles"></style>`;
    }

    // Update Styles
    const styleEl = doc.getElementById("anki-styles");
    if (styleEl) {
      styleEl.textContent = `
        ${css}
        body {
          margin: 0;
          padding: 0;
          background-color: ${isNight ? "#2d2d2d" : "white"};
          color: ${isNight ? "white" : "black"};
          font-family: system-ui, -apple-system, sans-serif;
          overflow-wrap: break-word;
        }
        .cloze { font-weight: bold; color: blue; }
        .night .cloze { color: lightblue; }
        
        /* Scrollbar styling to match Anki/modern feel */
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #888; border-radius: 5px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
      `;
    }

    // Update Body Class
    // Anki puts 'card' and 'night' classes on the body
    doc.body.className = `card ${nightClass}`;

    // Update Content
    // Only update if changed to prevent losing scroll position or focus if possible
    // But here we are rendering a template, so usually it changes fully.
    if (doc.body.innerHTML !== htmlContent) {
      doc.body.innerHTML = htmlContent;
    }
  });
</script>

<div class="preview-container {isNight ? 'night' : ''}">
  <div class="header-bar">
    <div class="tabs">
      <button
        class:active={activeTab === "front"}
        onclick={() => (activeTab = "front")}>Front</button
      >
      <button
        class:active={activeTab === "back"}
        onclick={() => (activeTab = "back")}>Back</button
      >
    </div>
    <div class="toggles">
      <button
        class:active={isMobile}
        onclick={toggleMobile}
        title="Toggle Mobile View"
      >
        📱
      </button>
      <button
        class:active={isNight}
        onclick={toggleNight}
        title="Toggle Night Mode"
      >
        🌙
      </button>
    </div>
  </div>

  <div class="preview-wrapper {isMobile ? 'mobile' : ''}">
    <div class="iframe-container">
      <iframe
        bind:this={iframe}
        title="Card Preview"
        sandbox="allow-same-origin allow-scripts"
      ></iframe>
    </div>
  </div>
</div>

<style>
  .preview-container {
    height: 100%;
    background: #f0f0f0;
    display: flex;
    flex-direction: column; /* Stack header and preview */
    overflow: hidden;
    position: relative;
  }

  .preview-container.night {
    background: #2d2d2d;
  }

  .header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background: #e0e0e0;
    border-bottom: 1px solid #ccc;
  }

  .night .header-bar {
    background: #333;
    border-color: #444;
  }

  .preview-wrapper {
    flex: 1; /* Take remaining space */
    width: 100%;
    max-width: 800px;
    margin: 0 auto; /* Center horizontally */
    display: flex;
    flex-direction: column;
    padding: 1rem; /* Add some padding around the card area */
    box-sizing: border-box;
  }

  .preview-wrapper.mobile {
    width: 375px;
    padding: 1rem 0; /* Vertical padding only for mobile view */
  }

  .iframe-container {
    flex: 1;
    background: white;
    /* Removed border-radius and box-shadow as requested */
    border-radius: 0;
    box-shadow: none;
    overflow: hidden;
    border: 1px solid #ddd; /* Optional: slight border to define area? Or completely flat? User said "don't want rounded corners and shadow". Let's keep a subtle border or just flat. */
  }

  .night .iframe-container {
    background: #2d2d2d;
    border-color: #444;
    box-shadow: none;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }

  .tabs {
    display: flex;
    gap: 0.5rem;
  }

  .toggles {
    display: flex;
    gap: 0.5rem;
  }

  button {
    background: transparent;
    border: none;
    padding: 0.4rem 0.8rem;
    cursor: pointer;
    font-size: 0.9rem;
    border-radius: 4px;
    color: #555;
    transition: all 0.2s;
  }

  .night button {
    color: #ccc;
  }

  button:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .night button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  button.active {
    background: #007acc;
    color: white;
  }

  .night button.active {
    background: #007acc;
    color: white;
  }
</style>
