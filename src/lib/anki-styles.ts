// Derived from Anki's _color-palette.scss and _vars.scss
// https://github.com/ankitects/anki/blob/main/ts/lib/sass/_color-palette.scss
// https://github.com/ankitects/anki/blob/main/ts/lib/sass/_vars.scss

const colorPalette = {
  lightgray: {
    0: "#fcfcfc",
    1: "#fafafa",
    2: "#f5f5f5",
    3: "#eeeeee",
    4: "#e4e4e4",
    5: "#d6d6d6",
    6: "#c4c4c4",
    7: "#afafaf",
    8: "#999999",
    9: "#858585",
  },
  darkgray: {
    0: "#737373",
    1: "#636363",
    2: "#545454",
    3: "#454545",
    4: "#363636",
    5: "#2c2c2c",
    6: "#252525",
    7: "#202020",
    8: "#141414",
    9: "#020202",
  },
  red: {
    0: "#fef2f2",
    1: "#fee2e2",
    2: "#fecaca",
    3: "#fca5a5",
    4: "#f87171",
    5: "#ef4444",
    6: "#dc2626",
    7: "#b91c1c",
    8: "#991b1b",
    9: "#7f1d1d",
  },
  orange: {
    0: "#fff7ed",
    1: "#ffedd5",
    2: "#fed7aa",
    3: "#fdba74",
    4: "#fb923c",
    5: "#f97316",
    6: "#ea580c",
    7: "#c2410c",
    8: "#9a3412",
    9: "#7c2d12",
  },
  amber: {
    0: "#fffbeb",
    1: "#fef3c7",
    2: "#fde68a",
    3: "#fcd34d",
    4: "#fbbf24",
    5: "#f59e0b",
    6: "#d97706",
    7: "#b45309",
    8: "#92400e",
    9: "#78350f",
  },
  yellow: {
    0: "#fefce8",
    1: "#fef9c3",
    2: "#fef08a",
    3: "#fde047",
    4: "#facc15",
    5: "#eab308",
    6: "#ca8a04",
    7: "#a16207",
    8: "#854d0e",
    9: "#713f12",
  },
  lime: {
    0: "#f7fee7",
    1: "#ecfccb",
    2: "#d9f99d",
    3: "#bef264",
    4: "#a3e635",
    5: "#84cc16",
    6: "#65a30d",
    7: "#4d7c0f",
    8: "#3f6212",
    9: "#365314",
  },
  green: {
    0: "#f0fdf4",
    1: "#dcfce7",
    2: "#bbf7d0",
    3: "#86efac",
    4: "#4ade80",
    5: "#22c55e",
    6: "#16a34a",
    7: "#15803d",
    8: "#166534",
    9: "#14532d",
  },
  teal: {
    0: "#f0fdfa",
    1: "#ccfbf1",
    2: "#99f6e4",
    3: "#5eead4",
    4: "#2dd4bf",
    5: "#14b8a6",
    6: "#0d9488",
    7: "#0f766e",
    8: "#115e59",
    9: "#134e4a",
  },
  cyan: {
    0: "#ecfeff",
    1: "#cffafe",
    2: "#a5f3fc",
    3: "#67e8f9",
    4: "#22d3ee",
    5: "#06b6d4",
    6: "#0891b2",
    7: "#0e7490",
    8: "#155e75",
    9: "#164e63",
  },
  sky: {
    0: "#f0f9ff",
    1: "#e0f2fe",
    2: "#bae6fd",
    3: "#7dd3fc",
    4: "#38bdf8",
    5: "#0ea5e9",
    6: "#0284c7",
    7: "#0369a1",
    8: "#075985",
    9: "#0c4a6e",
  },
  blue: {
    0: "#eff6ff",
    1: "#dbeafe",
    2: "#bfdbfe",
    3: "#93c5fd",
    4: "#60a5fa",
    5: "#3b82f6",
    6: "#2563eb",
    7: "#1d4ed8",
    8: "#1e40af",
    9: "#1e3a8a",
  },
  indigo: {
    0: "#eef2ff",
    1: "#e0e7ff",
    2: "#c7d2fe",
    3: "#a5b4fc",
    4: "#818cf8",
    5: "#6366f1",
    6: "#4f46e5",
    7: "#4338ca",
    8: "#3730a3",
    9: "#312e81",
  },
  violet: {
    0: "#f5f3ff",
    1: "#ede9fe",
    2: "#ddd6fe",
    3: "#c4b5fd",
    4: "#a78bfa",
    5: "#8b5cf6",
    6: "#7c3aed",
    7: "#6d28d9",
    8: "#5b21b6",
    9: "#4c1d95",
  },
  purple: {
    0: "#faf5ff",
    1: "#f3e8ff",
    2: "#e9d5ff",
    3: "#d8b4fe",
    4: "#c084fc",
    5: "#a855f7",
    6: "#9333ea",
    7: "#7e22ce",
    8: "#6b21a8",
    9: "#581c87",
  },
  fuchsia: {
    0: "#fdf4ff",
    1: "#fae8ff",
    2: "#f5d0fe",
    3: "#f0abfc",
    4: "#e879f9",
    5: "#d946ef",
    6: "#c026d3",
    7: "#a21caf",
    8: "#86198f",
    9: "#701a75",
  },
  pink: {
    0: "#fdf2f8",
    1: "#fce7f3",
    2: "#fbcfe8",
    3: "#f9a8d4",
    4: "#f472b6",
    5: "#ec4899",
    6: "#db2777",
    7: "#be185d",
    8: "#9d174d",
    9: "#831843",
  },
} as const;

type PaletteKey = keyof typeof colorPalette;
// Use a more generic type for shade to avoid strict checking against lightgray's keys
type Shade = keyof typeof colorPalette['lightgray'] | number;

function palette(key: PaletteKey, shade: Shade): string {
  // @ts-ignore
  return colorPalette[key][shade];
}

// Helper to approximate Sass color.scale (simplified)
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function alpha(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const a = 1 + (amount / 100); 
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a.toFixed(2)})`;
}

// Simplified vars definition based on _vars.scss
const vars = {
  fg: {
    default: { light: palette('darkgray', 9), dark: palette('lightgray', 0) },
    subtle: { light: palette('darkgray', 0), dark: palette('lightgray', 9) },
    disabled: { light: palette('lightgray', 9), dark: palette('darkgray', 0) },
    faint: { light: palette('lightgray', 7), dark: palette('darkgray', 2) },
    link: { light: palette('blue', 7), dark: palette('blue', 2) },
  },
  canvas: {
    default: { light: palette('lightgray', 2), dark: palette('darkgray', 5) },
    elevated: { light: '#ffffff', dark: palette('darkgray', 4) },
    inset: { light: '#ffffff', dark: palette('darkgray', 5) },
    overlay: { light: palette('lightgray', 0), dark: palette('darkgray', 5) },
    code: { light: '#ffffff', dark: palette('darkgray', 6) },
    glass: { 
      light: alpha('#ffffff', -60), 
      dark: alpha(palette('darkgray', 4), -60) 
    },
  },
  border: {
    default: { light: palette('lightgray', 6), dark: palette('darkgray', 7) },
    subtle: { light: palette('lightgray', 4), dark: palette('darkgray', 6) },
    strong: { light: palette('lightgray', 9), dark: palette('darkgray', 9) },
    focus: { light: palette('blue', 5), dark: palette('blue', 5) },
  },
  button: {
    bg: { light: palette('lightgray', 0), dark: palette('darkgray', 4) },
    hover_border: { light: palette('lightgray', 8), dark: palette('darkgray', 8) },
  },
  scrollbar: {
    bg: { light: palette('lightgray', 5), dark: palette('darkgray', 3) },
    bg_hover: { light: palette('lightgray', 6), dark: palette('darkgray', 2) },
    bg_active: { light: palette('lightgray', 7), dark: palette('darkgray', 1) },
  }
};

export function generateAnkiCss(isMac: boolean = false): string {
  let lightVars = '';
  let darkVars = '';

  function process(obj: any, prefix: string) {
    for (const key in obj) {
      const val = obj[key];
      if (val.light && val.dark) {
        const varName = `--${prefix}${key === 'default' ? '' : '-' + key}`;
        lightVars += `${varName}: ${val.light};\n`;
        darkVars += `${varName}: ${val.dark};\n`;
      } else if (typeof val === 'object') {
        process(val, `${prefix}${key === 'default' ? '' : '-' + key}`);
      }
    }
  }

  process(vars.fg, 'fg');
  process(vars.canvas, 'canvas');
  process(vars.border, 'border');
  process(vars.button, 'button');
  process(vars.scrollbar, 'scrollbar');

  // Platform-specific button styles (from webview.py standard_css)
  const buttonStyle = isMac ? `
    button {
      --canvas: #fff;
      -webkit-appearance: none;
      background: var(--canvas);
      border-radius: var(--border-radius);
      padding: 3px 12px;
      border: 1px solid var(--border);
      box-shadow: 0px 1px 3px var(--border-subtle);
      font-family: Helvetica;
    }
    /* Night mode button - support all compatibility class names */
    .night-mode button,
    .night_mode button,
    .nightMode button { 
      --canvas: #606060; 
      --fg: #eee; 
    }
    
    /* Legacy compatibility: support old night mode selectors */
    body.night_mode button,
    body.nightMode button {
      --canvas: #606060;
      --fg: #eee;
    }
  ` : `
    button {
      font-family: system-ui, -apple-system, sans-serif;
    }
    /* Input field focus outline */
    textarea:focus, input:focus, input[type]:focus, .uneditable-input:focus,
    div[contenteditable="true"]:focus {
      outline: 0 none;
      border-color: var(--border-focus);
    }
  `;

  // Based on Anki's webview.scss and webview.py
  return `
    /* CSS Variables */
    :root {
      ${lightVars}
      --transition-medium: 500ms;
      --transition: 180ms;
      --border-radius: 5px;
    }
    :root.night-mode {
      ${darkVars}
    }
    
    /* Base Styles - matching Anki's webview.scss */
    * {
      /* Keep content-box for compatibility with Anki card templates */
      box-sizing: content-box;
    }
    
    html {
      font-family: ${isMac ? '"Helvetica"' : 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'};
    }
    
    body {
      zoom: 1;
      color: var(--fg);
      background: var(--canvas);
      margin: 2em;
      overscroll-behavior: none;
      font-size: 15px;
    }
    
    body.fancy {
      transition: opacity var(--transition-medium) ease-out;
    }
    
    a {
      color: var(--fg-link);
      text-decoration: none;
    }
    
    h1 {
      margin-bottom: 0.2em;
    }
    
    ${buttonStyle}
    
    /* Custom Scrollbar - matching Anki's implementation */
    ::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }
    
    ::-webkit-scrollbar-track {
      background-color: transparent;
    }
    
    ::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar-bg);
      border-radius: 3px;
      border: 2px solid transparent;
      background-clip: padding-box;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background-color: var(--scrollbar-bg-hover);
    }
    
    ::-webkit-scrollbar-thumb:active {
      background-color: var(--scrollbar-bg-active);
    }
    
    ::-webkit-scrollbar-corner {
      background-color: transparent;
    }
    
    /* Cloze styling */
    .cloze {
      font-weight: bold;
      color: blue;
    }
    
    /* Night mode cloze - support all compatibility class names */
    .night-mode .cloze,
    .night_mode .cloze,
    .nightMode .cloze {
      color: lightblue;
    }
    
    /* Legacy compatibility: support old night mode selectors */
    body.night_mode .cloze,
    body.nightMode .cloze {
      color: lightblue;
    }
  `;
}
