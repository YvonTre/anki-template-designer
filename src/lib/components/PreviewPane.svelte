<script lang="ts">
  import { appState } from "../stores/appState.svelte.js";

  // Simple template renderer
  function renderTemplate(template: string, fields: Record<string, string>, isFront: boolean = false) {
    let rendered = template;

    // Helper to check if text contains HTML tags
    const hasHtml = (text: string) => /<[a-z][\s\S]*>/i.test(text);

    // Handle Cloze: {{cloze:Field}}
    // Simple regex to match {{cloze:FieldName}}
    const clozeRegex = /{{cloze:([^}]+)}}/g;
    rendered = rendered.replace(clozeRegex, (_, fieldName) => {
      const rawContent = fields[fieldName] || "";
      const isHtml = hasHtml(rawContent);

      // Apply Cloze Replacement based on front/back
      // Format: {{c1::Answer::Hint}} or {{c1::Answer}}
      let content = rawContent.replace(
        /{{c\d+::(.*?)(::(.*?))?}}/g,
        (match, answer, _, hint) => {
          if (isFront) {
            // Front: Show placeholder [...] or [Hint] if hint exists
            const placeholder = hint ? `[${hint}]` : '[...]';
            return `<span class="cloze">${placeholder}</span>`;
          } else {
            // Back: Show the answer with cloze styling
            return `<span class="cloze">${answer}</span>`;
          }
        }
      );

      // Handle Newlines (if original content was plain text)
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
    return renderTemplate(appState.templates.front, appState.sampleData, true);
  });

  let backHtml = $derived.by(() => {
    let html = appState.templates.back;
    // Replace {{FrontSide}} with the rendered front (front should show placeholders)
    html = html.replace(/{{FrontSide}}/g, frontHtml);
    return renderTemplate(html, appState.sampleData, false);
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

  import { generateAnkiCss } from "../anki-styles";

  let iframe: HTMLIFrameElement;

  $effect(() => {
    if (!iframe?.contentDocument) return;

    const doc = iframe.contentDocument;
    const htmlContent = activeTab === "front" ? frontHtml : backHtml;

    // Detect platform (we can use navigator to detect Mac)
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

    // Generate Standard CSS from Anki variables
    const standardCss = generateAnkiCss(isMac);

    // Determine body class (matching Anki's body_class)
    // For compatibility: Anki uses night-mode, night_mode, and nightMode (legacy)
    const bodyClasses = ["card"];
    if (isNight) {
      bodyClasses.push("night-mode");
      bodyClasses.push("night_mode"); // Legacy compatibility
      bodyClasses.push("nightMode"); // Legacy compatibility
    }
    if (isMobile) bodyClasses.push("mobile");
    if (isMac) bodyClasses.push("isMac");

    // Construct the full HTML document
    // Matching Anki's stdHtml structure with dir and data-bs-theme attributes
    const html = `
      <!DOCTYPE html>
      <html class="${isNight ? "night-mode" : ""}" dir="ltr" data-bs-theme="${isNight ? "dark" : "light"}">
      <head>
        <meta charset="utf-8">
        <title>Anki Preview</title>
        <style>${standardCss}</style>
        <style>${css}</style>
      </head>
      <body class="${bodyClasses.join(" ")}">
        ${htmlContent}
      </body>
      </html>
    `;

    // Write to iframe
    doc.open();
    doc.write(html);
    doc.close();
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
