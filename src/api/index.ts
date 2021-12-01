import { BaseRecord } from './airtable';

export interface API<T extends BaseRecord> {
  create?: (record: Partial<T>) => Promise<T['id']>;
  find: (id: T['id']) => Promise<T>;
  list: () => Promise<T[]>;
}
