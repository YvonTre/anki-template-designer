// IndexedDB storage utility for Anki Template Designer

const DB_NAME = 'anki-template-designer';
const DB_VERSION = 1;
const STORE_NAME = 'templates';

export interface SavedTemplate {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  data: {
    noteTypes: Array<{ name: string; fields: string[] }>;
    currentNoteTypeId: string;
    templatesMap: Record<string, { front: string; back: string; css: string }>;
    sampleData: Record<string, string>;
  };
}

class StorageManager {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  private async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          objectStore.createIndex('name', 'name', { unique: false });
          objectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  async saveTemplate(name: string, data: SavedTemplate['data']): Promise<string> {
    const db = await this.init();
    const id = crypto.randomUUID();
    const now = Date.now();

    const template: SavedTemplate = {
      id,
      name,
      createdAt: now,
      updatedAt: now,
      data,
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(template);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(id);
    });
  }

  async updateTemplate(id: string, name: string, data: SavedTemplate['data']): Promise<void> {
    const db = await this.init();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onerror = () => reject(getRequest.error);
      getRequest.onsuccess = () => {
        const existing = getRequest.result;
        if (!existing) {
          reject(new Error('Template not found'));
          return;
        }

        const updated: SavedTemplate = {
          ...existing,
          name,
          updatedAt: Date.now(),
          data,
        };

        const putRequest = store.put(updated);
        putRequest.onerror = () => reject(putRequest.error);
        putRequest.onsuccess = () => resolve();
      };
    });
  }

  async getTemplate(id: string): Promise<SavedTemplate | null> {
    const db = await this.init();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async getAllTemplates(): Promise<SavedTemplate[]> {
    const db = await this.init();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const templates = request.result as SavedTemplate[];
        // Sort by updatedAt descending
        templates.sort((a, b) => b.updatedAt - a.updatedAt);
        resolve(templates);
      };
    });
  }

  async deleteTemplate(id: string): Promise<void> {
    const db = await this.init();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const storage = new StorageManager();

