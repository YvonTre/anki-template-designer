import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { appState } from '../stores/appState.svelte.js';

/**
 * List of Anki CSS variables
 */
const ANKI_CSS_VARS = [
  // Foreground colors
  '--fg',
  '--fg-subtle',
  '--fg-disabled',
  '--fg-link',
  // Background colors
  '--canvas',
  '--canvas-elevated',
  '--canvas-inset',
  // Borders
  '--border',
  '--border-subtle',
  '--border-focus',
  // Scrollbar
  '--scrollbar-bg',
  '--scrollbar-bg-hover',
  '--scrollbar-bg-active',
  // Transitions
  '--transition',
  '--transition-medium',
  // Border radius
  '--border-radius',
];

/**
 * Anki special fields
 */
const ANKI_SPECIAL_FIELDS = ['FrontSide'];

/**
 * Get all fields of the current note type
 */
function getCurrentFields(): string[] {
  const currentNoteType = appState.noteTypes.find(
    (n) => n.name === appState.currentNoteTypeId
  );
  return currentNoteType?.fields || [];
}

/**
 * Anki field completion source (for HTML template editor)
 */
export function ankiFieldCompletions(
  context: CompletionContext
): CompletionResult | null {
  const { state, pos } = context;
  const text = state.doc.toString();
  const before = text.slice(Math.max(0, pos - 50), pos);

  // Detect {{c pattern (cloze numbers like c1, c2, c3...)
  const cMatch = before.match(/\{\{c(\d*)$/);
  if (cMatch) {
    const matchStart = pos - cMatch[0].length;
    return {
      from: matchStart + 2, // Start from 'c'
      options: Array.from({ length: 9 }, (_, i) => ({
        label: `c${i + 1}`,
        type: 'cloze-number',
        apply: `c${i + 1}::`, // Automatically add ::
        info: `Cloze deletion ${i + 1}`,
        boost: 10 - i, // Prioritize earlier numbers
      })),
    };
  }

  // Detect {{cloze: pattern (requires field name)
  const clozeMatch = before.match(/\{\{cloze:([^}]*)$/);
  if (clozeMatch) {
    const partialField = clozeMatch[1];
    const fields = getCurrentFields();
    const matchStart = pos - partialField.length;
    
    // Check if there's already } or }} after cursor
    const after = text.slice(pos, Math.min(pos + 2, text.length));
    let insertSuffix = '}}';
    let toPos = pos;
    
    // If there's already one }, only add one more }
    if (after.startsWith('}')) {
      insertSuffix = '}';
      toPos = pos + 1; // Replace the existing }
    }
    
    return {
      from: matchStart,
      to: toPos,
      options: fields
        .filter((field) =>
          field.toLowerCase().includes(partialField.toLowerCase())
        )
        .map((field) => ({
          label: field,
          type: 'field',
          apply: `${field}${insertSuffix}`, // Add }} or } based on context
          info: `Field: ${field}`,
        })),
    };
  }

  // Detect {{ pattern (regular fields or special syntax)
  const fieldMatch = before.match(/\{\{([^}]*)$/);
  if (fieldMatch) {
    const partial = fieldMatch[1];
    // If 'c' or 'cloze' is already entered, don't handle here
    if (partial.startsWith('c') || partial.startsWith('cloze')) {
      return null;
    }

    const fields = getCurrentFields();
    const matchStart = pos - partial.length;
    
    // Check if there's already } or }} after cursor
    const after = text.slice(pos, Math.min(pos + 2, text.length));
    let insertSuffix = '}}';
    let toPos = pos;
    
    // If there's already one }, only add one more }
    if (after.startsWith('}')) {
      insertSuffix = '}';
      toPos = pos + 1; // Replace the existing }
    }
    
    const options = [];

    // Add field completions
    fields
      .filter((field) =>
        partial === '' || field.toLowerCase().includes(partial.toLowerCase())
      )
      .forEach((field) => {
        options.push({
          label: field,
          type: 'field',
          apply: `${field}${insertSuffix}`,
          info: `Field: ${field}`,
        });
      });

    // Add special fields
    ANKI_SPECIAL_FIELDS.filter(
      (field) =>
        partial === '' || field.toLowerCase().includes(partial.toLowerCase())
    ).forEach((field) => {
      options.push({
        label: field,
        type: 'special-field',
        apply: `${field}${insertSuffix}`,
        info: `Special field: ${field}`,
      });
    });

    // Add cloze syntax hint
    if (partial === '' || 'cloze'.startsWith(partial.toLowerCase())) {
      options.push({
        label: 'cloze:',
        type: 'keyword',
        apply: 'cloze:',
        info: 'Cloze deletion syntax: {{cloze:FieldName}}',
      });
    }

    if (options.length > 0) {
      return {
        from: matchStart,
        to: toPos,
        options,
      };
    }
  }

  return null;
}

/**
 * Anki CSS variable completion source (for CSS editor)
 */
export function ankiCssVarCompletions(
  context: CompletionContext
): CompletionResult | null {
  const { state, pos } = context;
  const text = state.doc.toString();
  const before = text.slice(Math.max(0, pos - 30), pos);

  // Detect var(-- pattern
  const varMatch = before.match(/var\(--([^)]*)$/);
  if (varMatch) {
    const partial = varMatch[1];
    const matchStart = pos - partial.length;
    return {
      from: matchStart,
      options: ANKI_CSS_VARS.filter((v) =>
        v.toLowerCase().includes(partial.toLowerCase())
      ).map((v) => ({
        label: v,
        type: 'variable',
        apply: v,
        info: `Anki CSS variable`,
      })),
    };
  }

  // Detect -- pattern (direct variable usage)
  const directVarMatch = before.match(/--([^;}\s]*)$/);
  if (directVarMatch && !before.includes('var(')) {
    const partial = directVarMatch[1];
    const matchStart = pos - partial.length;
    return {
      from: matchStart,
      options: ANKI_CSS_VARS.filter((v) =>
        v.toLowerCase().includes(partial.toLowerCase())
      ).map((v) => ({
        label: v,
        type: 'variable',
        apply: v,
        info: `Anki CSS variable`,
      })),
    };
  }

  return null;
}

