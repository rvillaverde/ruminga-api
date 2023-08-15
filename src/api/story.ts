import { API } from '.';
import config from '../config';
import Airtable, { AirtableRecord } from './airtable';
import photoApi, { Photo } from './photo';

const TABLE = 'story';

interface StoryInfo {
  country: string;
  description: string;
  name: string;
  place: string;
}

export interface Story {
  background: 'black' | 'white';
  cardPosition: 'left' | 'right';
  en: StoryInfo;
  es: StoryInfo;
  id: string;
  internalId: string;
  order: number;
  show: boolean;
  thumbnail: {
    height: number;
    url: string;
    width: number;
  };
  year: number;
}

const mapInfo = (record: AirtableRecord): Pick<Story, 'en' | 'es'> => ({
  en: {
    country: record.get('country_en') as string,
    description: record.get('description_en') as string,
    name: record.get('name_en') as string,
    place: record.get('place_en') as string,
  },
  es: {
    country: record.get('country_es') as string,
    description: record.get('description_es') as string,
    name: record.get('name_es') as string,
    place: record.get('place_es') as string,
  },
});

const map = async (record: AirtableRecord): Promise<Story> => {
  const id = record.get('id') as string;
  const { en, es } = mapInfo(record);

  return Promise.resolve({
    background: (record.get('background') as Story['background']) || 'white',
    cardPosition: record.get('cardPosition') as Story['cardPosition'],
    en,
    es,
    id,
    internalId: record.id,
    order: record.get('order') as Story['order'],
    show: record.get('show') as Story['show'],
    thumbnail: await getThumbnail(record.get('thumbnail_id') as string),
    year: record.get('year') as Story['year'],
  });
};

const getThumbnail = async (id: Photo['id']): Promise<Story['thumbnail']> => {
  const {
    image: { height, width },
  } = await photoApi.find(id);

  return {
    height,
    url: `${config.baseUrl}/photos/${id}/image`,
    width,
  };
};

const airtable = new Airtable<Story>(TABLE, map);

const api: API<Story> = {
  find: async (id: string): Promise<Story> => airtable.find(id),
  list: async (): Promise<Story[]> =>
    (await airtable.findByField('show', '1')).sort((a, b) => a.order - b.order),
};

export default api;
