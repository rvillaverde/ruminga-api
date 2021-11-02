import Airtable, { AirtableRecord } from './airtable';

const TABLE = 'story';

export interface Story {
  id: string;
  name: string;
}

const map = (record: AirtableRecord): Story => ({
  id: record.get('id') as string,
  name: record.get('name') as string,
});

const airtable = new Airtable<Story>(map, TABLE);

const api = {
  get: async (id: string): Promise<Story> => await airtable.get(id),
  list: async (): Promise<Story[]> => await airtable.selectAll(),
};

export default api;
