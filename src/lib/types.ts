export interface NoteType {
  name: string;
  fields: string[];
}

export interface Templates {
  front: string;
  back: string;
  css: string;
}

export interface AppState {
  noteType: NoteType;
  templates: Templates;
  sampleData: Record<string, string>;
  ui: {
    isMobile: boolean;
    isNight: boolean;
  };
}
