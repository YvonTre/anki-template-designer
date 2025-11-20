<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { EditorView } from '@codemirror/view';
  import { EditorState } from '@codemirror/state';
  import { html } from '@codemirror/lang-html';
  import { css } from '@codemirror/lang-css';
  import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
  import { keymap } from '@codemirror/view';
  import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
  import { oneDark } from '@codemirror/theme-one-dark';
  import {
    ankiFieldCompletions,
    ankiCssVarCompletions,
  } from '../utils/ankiCompletions.js';

  interface Props {
    value: string;
    language: 'html' | 'css';
    placeholder?: string;
    onInput?: (value: string) => void;
  }

  let {
    value = $bindable(''),
    language = 'html',
    onInput,
  }: Props = $props();

  let editorContainer: HTMLDivElement;
  let editorView: EditorView | null = null;

  onMount(() => {
    if (!editorContainer) return;

    // Select language extension based on language type
    const languageExtension =
      language === 'html' ? html() : css();

    // Select completion source based on language
    const completionSource =
      language === 'html'
        ? autocompletion({
            override: [ankiFieldCompletions],
          })
        : autocompletion({
            override: [ankiCssVarCompletions],
          });

    // Create editor state
    const startState = EditorState.create({
      doc: value,
      extensions: [
        history(), // Undo/redo support
        languageExtension,
        completionSource,
        oneDark, // Use dark theme to match existing design
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...completionKeymap,
          indentWithTab, // Tab key for indentation instead of leaving editor
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            value = newValue;
            onInput?.(newValue);
          }
        }),
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '14px',
          },
          '.cm-editor': {
            height: '100%',
          },
          '.cm-scroller': {
            height: '100%',
            fontFamily: 'monospace',
          },
          '.cm-content': {
            padding: '1rem',
            minHeight: '100%',
          },
          '.cm-focused': {
            outline: 'none',
          },
        }),
      ],
    });

    // Create editor view
    editorView = new EditorView({
      state: startState,
      parent: editorContainer,
    });
  });

  onDestroy(() => {
    editorView?.destroy();
  });

  // Update editor when external value changes
  $effect(() => {
    if (editorView && editorView.state.doc.toString() !== value) {
      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: value,
        },
      });
    }
  });
</script>

<div bind:this={editorContainer} class="codemirror-wrapper"></div>

<style>
  .codemirror-wrapper {
    flex: 1;
    height: 100%;
    overflow: hidden;
  }

  :global(.codemirror-wrapper .cm-editor) {
    height: 100%;
  }

  :global(.codemirror-wrapper .cm-scroller) {
    overflow: auto;
  }
</style>

