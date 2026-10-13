/**
 * Durable state for the HUB NET Google build.
 *
 * Prefers Cloud Firestore (`@google-cloud/firestore`) when the project + ADC are
 * available; otherwise falls back to an in-process Map so the demo runs with zero
 * setup. Either way the domain code talks to the same small `Store` interface.
 */

export interface Store {
  readonly kind: 'firestore' | 'memory';
  get<T>(collection: string, id: string): Promise<T | undefined>;
  put<T>(collection: string, id: string, doc: T): Promise<void>;
  list<T>(collection: string): Promise<T[]>;
}

class MemoryStore implements Store {
  readonly kind = 'memory' as const;
  private data = new Map<string, Map<string, unknown>>();

  private col(collection: string): Map<string, unknown> {
    let c = this.data.get(collection);
    if (!c) {
      c = new Map();
      this.data.set(collection, c);
    }
    return c;
  }

  async get<T>(collection: string, id: string): Promise<T | undefined> {
    return this.col(collection).get(id) as T | undefined;
  }

  async put<T>(collection: string, id: string, doc: T): Promise<void> {
    this.col(collection).set(id, doc);
  }

  async list<T>(collection: string): Promise<T[]> {
    return [...this.col(collection).values()] as T[];
  }
}

class FirestoreStore implements Store {
  readonly kind = 'firestore' as const;

  constructor(private db: {
    collection: (c: string) => {
      doc: (id: string) => { get: () => Promise<{ exists: boolean; data: () => unknown }>; set: (d: unknown) => Promise<unknown> };
      get: () => Promise<{ docs: Array<{ data: () => unknown }> }>;
    };
  }) {}

  async get<T>(collection: string, id: string): Promise<T | undefined> {
    const snap = await this.db.collection(collection).doc(id).get();
    return snap.exists ? (snap.data() as T) : undefined;
  }

  async put<T>(collection: string, id: string, doc: T): Promise<void> {
    await this.db.collection(collection).doc(id).set(doc);
  }

  async list<T>(collection: string): Promise<T[]> {
    const snap = await this.db.collection(collection).get();
    return snap.docs.map(d => d.data() as T);
  }
}

export async function createStore(): Promise<Store> {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
  const firestoreDisabled = process.env.DGUI_HUBNET_STORE === 'memory';
  if (projectId && !firestoreDisabled) {
    try {
      const mod = await import('@google-cloud/firestore');
      const db = new mod.Firestore({ projectId });
      return new FirestoreStore(db as unknown as ConstructorParameters<typeof FirestoreStore>[0]);
    } catch {
      // no ADC / package unavailable — fall through to memory
    }
  }
  return new MemoryStore();
}
