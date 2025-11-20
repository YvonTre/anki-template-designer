import type { AppState, NoteType, Templates } from '../types';

const BASIC_TEMPLATES: Templates = {
  front: '{{Front}}',
  back: '{{FrontSide}}\n\n<hr id=answer>\n\n{{Back}}',
  css: '.card {\n font-family: arial;\n font-size: 20px;\n text-align: center;\n color: black;\n background-color: white;\n}\n'
};

const CLOZE_TEMPLATES: Templates = {
  front: '{{cloze:Text}}',
  back: '{{cloze:Text}}\n\n<br>\n\n{{Extra}}',
  css: '.card {\n font-family: arial;\n font-size: 20px;\n text-align: center;\n color: black;\n background-color: white;\n}\n\n.cloze {\n font-weight: bold;\n color: blue;\n}\n.night .cloze {\n color: lightblue;\n}'
};

export const appState = $state<AppState & { 
  noteTypes: NoteType[]; 
  currentNoteTypeId: string;
  templatesMap: Record<string, Templates>;
}>({
  // Note Type Definition
  noteType: { // Legacy
    name: 'Basic',
    fields: ['Front', 'Back']
  },
  
  noteTypes: [
    { name: 'Basic', fields: ['Front', 'Back'] },
    { name: 'Cloze', fields: ['Text', 'Extra'] }
  ],
  currentNoteTypeId: 'Basic',

  templatesMap: {
    'Basic': { ...BASIC_TEMPLATES },
    'Cloze': { ...CLOZE_TEMPLATES }
  },

  // Templates (Derived from current note type)
  get templates() {
    return this.templatesMap[this.currentNoteTypeId];
  },
  set templates(v) {
    this.templatesMap[this.currentNoteTypeId] = v;
  },

  // Sample Data for Preview
  sampleData: {
    Front: 'What is the capital of France?',
    Back: 'Paris',
    Text: 'The capital of France is {{c1::Paris}}.',
    Extra: 'It is a beautiful city.'
  },

  // UI State
  ui: {
    isMobile: false,
    isNight: false
  }
});

export function addField(name: string) {
  const currentNoteType = appState.noteTypes.find(n => n.name === appState.currentNoteTypeId);
  if (!currentNoteType || !name || currentNoteType.fields.includes(name)) return;
  
  currentNoteType.fields.push(name);
  appState.sampleData[name] = `Sample ${name}`;
}

export function removeField(name: string) {
  const currentNoteType = appState.noteTypes.find(n => n.name === appState.currentNoteTypeId);
  if (!currentNoteType) return;

  currentNoteType.fields = currentNoteType.fields.filter(f => f !== name);
  delete appState.sampleData[name];
}

export function addNoteType(name: string) {
  if (appState.noteTypes.find(n => n.name === name)) return;
  appState.noteTypes.push({ name, fields: ['Front', 'Back'] });
  appState.templatesMap[name] = { ...BASIC_TEMPLATES };
  appState.currentNoteTypeId = name;
}

export function deleteNoteType(name: string) {
  if (appState.noteTypes.length <= 1) return; // Don't delete the last one
  appState.noteTypes = appState.noteTypes.filter(n => n.name !== name);
  delete appState.templatesMap[name];
  if (appState.currentNoteTypeId === name) {
    appState.currentNoteTypeId = appState.noteTypes[0].name;
  }
}

export function switchNoteType(name: string) {
  if (appState.noteTypes.find(n => n.name === name)) {
    appState.currentNoteTypeId = name;
  }
}
