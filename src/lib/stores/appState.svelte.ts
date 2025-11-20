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
  currentTemplateId: string | null; // Track which saved template is being edited
  currentTemplateName: string | null; // Track current template name
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

  // Current template being edited (null means new/unsaved)
  currentTemplateId: null,
  currentTemplateName: null,

  // Templates (Derived from current note type)
  get templates() {
    return this.templatesMap[this.currentNoteTypeId];
  },
  set templates(v) {
    this.templatesMap[this.currentNoteTypeId] = v;
    // Check for unsaved changes
    checkUnsavedChanges();
    // Auto-save if editing a saved template
    if (this.currentTemplateId) {
      autoSave();
    }
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
  checkUnsavedChanges();
  // Auto-save if editing a saved template
  if (appState.currentTemplateId) {
    autoSave();
  }
}

export function removeField(name: string) {
  const currentNoteType = appState.noteTypes.find(n => n.name === appState.currentNoteTypeId);
  if (!currentNoteType) return;

  currentNoteType.fields = currentNoteType.fields.filter(f => f !== name);
  delete appState.sampleData[name];
  checkUnsavedChanges();
  // Auto-save if editing a saved template
  if (appState.currentTemplateId) {
    autoSave();
  }
}

export function addNoteType(name: string) {
  if (appState.noteTypes.find(n => n.name === name)) return;
  appState.noteTypes.push({ name, fields: ['Front', 'Back'] });
  appState.templatesMap[name] = { ...BASIC_TEMPLATES };
  appState.currentNoteTypeId = name;
  checkUnsavedChanges();
  // Auto-save if editing a saved template
  if (appState.currentTemplateId) {
    autoSave();
  }
}

export function deleteNoteType(name: string) {
  if (appState.noteTypes.length <= 1) return; // Don't delete the last one
  appState.noteTypes = appState.noteTypes.filter(n => n.name !== name);
  delete appState.templatesMap[name];
  if (appState.currentNoteTypeId === name) {
    appState.currentNoteTypeId = appState.noteTypes[0].name;
  }
  checkUnsavedChanges();
  // Auto-save if editing a saved template
  if (appState.currentTemplateId) {
    autoSave();
  }
}

export function switchNoteType(name: string) {
  if (appState.noteTypes.find(n => n.name === name)) {
    appState.currentNoteTypeId = name;
    checkUnsavedChanges();
    // Auto-save if editing a saved template
    if (appState.currentTemplateId) {
      autoSave();
    }
  }
}

// Auto-save debounce timer
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;
let isAutoSaving = $state(false);
let autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error' = $state('idle');

// Track saved state snapshot for comparison
let savedStateSnapshot: ReturnType<typeof getCurrentData> | null = null;
let hasUnsavedChanges = $state(false);

async function autoSave() {
  if (!appState.currentTemplateId) {
    autoSaveStatus = 'idle';
    isAutoSaving = false;
    return;
  }
  
  // Clear existing timer
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
  }
  
  // Debounce: save after 1000ms (1 second) of no changes
  // Only set saving status when actually starting to save
  autoSaveTimer = setTimeout(async () => {
    // Set status to saving only when actually starting the save
    autoSaveStatus = 'saving';
    isAutoSaving = true;
    
    try {
      const { storage } = await import('../utils/storage.js');
      const template = await storage.getTemplate(appState.currentTemplateId!);
      if (!template) {
        autoSaveStatus = 'idle';
        isAutoSaving = false;
        return;
      }
      
      const data = getCurrentData();
      await storage.updateTemplate(appState.currentTemplateId!, template.name, data);
      autoSaveStatus = 'saved';
      isAutoSaving = false;
      markAsSaved(); // Mark as saved after auto-save
      
      // Clear saved status after 2 seconds
      setTimeout(() => {
        if (autoSaveStatus === 'saved') {
          autoSaveStatus = 'idle';
        }
      }, 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      autoSaveStatus = 'error';
      isAutoSaving = false;
      
      // Clear error status after 3 seconds
      setTimeout(() => {
        if (autoSaveStatus === 'error') {
          autoSaveStatus = 'idle';
        }
      }, 3000);
    }
  }, 1000); // Increased debounce time to 1 second for better UX
}

export const autoSaveState = {
  get status() {
    return autoSaveStatus;
  },
  get isSaving() {
    return isAutoSaving;
  },
};

// Helper function to trigger auto-save when sampleData is modified
export function triggerAutoSaveOnSampleDataChange() {
  checkUnsavedChanges();
  if (appState.currentTemplateId) {
    autoSave();
  }
}

// Helper function to trigger check and auto-save for template changes
export function triggerTemplateChange() {
  checkUnsavedChanges();
  if (appState.currentTemplateId) {
    autoSave();
  }
}

export function getHasUnsavedChanges() {
  return hasUnsavedChanges;
}

function getCurrentData() {
  return {
    noteTypes: appState.noteTypes.map(nt => ({ name: nt.name, fields: [...nt.fields] })),
    currentNoteTypeId: appState.currentNoteTypeId,
    templatesMap: Object.fromEntries(
      Object.entries(appState.templatesMap).map(([key, value]) => [
        key,
        { front: value.front, back: value.back, css: value.css }
      ])
    ),
    sampleData: { ...appState.sampleData },
  };
}

function checkUnsavedChanges() {
  if (!appState.currentTemplateId) {
    // If no template is associated, check if there are any changes from initial state
    hasUnsavedChanges = true; // Always show unsaved if no template
    return;
  }

  const current = getCurrentData();
  if (!savedStateSnapshot) {
    hasUnsavedChanges = false;
    return;
  }

  // Compare current state with saved snapshot
  const currentStr = JSON.stringify(current);
  const savedStr = JSON.stringify(savedStateSnapshot);
  hasUnsavedChanges = currentStr !== savedStr;
}

function markAsSaved() {
  savedStateSnapshot = getCurrentData();
  hasUnsavedChanges = false;
}

// Storage functions
export async function createNewTemplate(name: string): Promise<string> {
  const { storage } = await import('../utils/storage.js');
  const data = getCurrentData();
  const id = await storage.saveTemplate(name, data);
  appState.currentTemplateId = id;
  appState.currentTemplateName = name;
  markAsSaved(); // Mark as saved after creating
  return id;
}

let manualSaveStatus: 'idle' | 'saving' | 'saved' | 'error' = $state('idle');

export async function saveCurrentTemplate(): Promise<void> {
  if (!appState.currentTemplateId) {
    throw new Error('No template is currently being edited');
  }
  
  manualSaveStatus = 'saving';
  try {
    const { storage } = await import('../utils/storage.js');
    const template = await storage.getTemplate(appState.currentTemplateId);
    if (!template) throw new Error('Template not found');
    
    const data = getCurrentData();
    await storage.updateTemplate(appState.currentTemplateId, template.name, data);
    manualSaveStatus = 'saved';
    markAsSaved(); // Mark as saved after manual save
    
    // Clear saved status after 2 seconds
    setTimeout(() => {
      if (manualSaveStatus === 'saved') {
        manualSaveStatus = 'idle';
      }
    }, 2000);
  } catch (error) {
    manualSaveStatus = 'error';
    throw error;
  }
}

export const saveState = {
  get status() {
    return manualSaveStatus;
  },
  get isSaving() {
    return manualSaveStatus === 'saving';
  },
};

export async function loadFromStorage(id: string): Promise<void> {
  const { storage } = await import('../utils/storage.js');
  const template = await storage.getTemplate(id);
  if (!template) throw new Error('Template not found');

  // Restore state
  appState.noteTypes = template.data.noteTypes.map(nt => ({ name: nt.name, fields: [...nt.fields] }));
  appState.currentNoteTypeId = template.data.currentNoteTypeId;
  appState.templatesMap = { ...template.data.templatesMap };
  appState.sampleData = { ...template.data.sampleData };
  
  // Set as current template (enables auto-save)
  appState.currentTemplateId = id;
  appState.currentTemplateName = template.name;
  markAsSaved(); // Mark as saved after loading
}

export function clearCurrentTemplate(): void {
  appState.currentTemplateId = null;
  appState.currentTemplateName = null;
  savedStateSnapshot = null;
  hasUnsavedChanges = false;
}
