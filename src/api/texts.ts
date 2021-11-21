import { API } from '.';
import Airtable, { AirtableRecord } from './airtable';

const TABLE = 'texts';

interface TextsAPI extends API<Text> {
  texts: () => Promise<Texts>;
}

interface Texts {
  about: Text;
}

export interface Text {
  en: string;
  es: string;
  id: string;
}

const map = async (record: AirtableRecord): Promise<Text> => {
  return Promise.resolve({
    en: record.get('en') as string,
    es: record.get('es') as string,
    id: record.get('id') as string,
  });
};

const airtable = new Airtable<Text>(map, TABLE);

const api: TextsAPI = {
  find: async (id: string): Promise<Text> => await airtable.find(id),
  list: async (): Promise<Text[]> => await airtable.selectAll(),
  texts: async (): Promise<Texts> => {
    const texts = await api.list();

    return {
      about: texts.find(t => t.id === 'about'),
    };
  },
};

export default api;
