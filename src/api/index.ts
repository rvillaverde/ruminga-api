export interface BaseRecord {
  id: string;
}

export interface API<T extends BaseRecord> {
  list: () => Promise<T[]>;
  find: (id: T['id']) => Promise<T>;
}
