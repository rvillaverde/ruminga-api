import { API } from '.';
import Airtable, { AirtableRecord } from './airtable';

import photoApi, { Photo } from './photo';

const TABLE = 'story';

type Lang = 'en' | 'es';

interface StoryInfo {
  country: string;
  description: string;
  name: string;
  place: string;
}

export interface Story {
  cardPosition: 'left' | 'right';
  en: StoryInfo;
  es: StoryInfo;
  id: string;
  internalId: string;
  order: number;
  photos: Photo[];
  show: boolean;
  year: number;
}

const mapInfo = (record: AirtableRecord): Pick<Story, 'en' | 'es'> => {
  return {
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
  };
};

const map = async (record: AirtableRecord): Promise<Story> => {
  const id = record.get('id') as string;
  const { photos } = await getLinkedRecords(id);
  const { en, es } = mapInfo(record);

  return Promise.resolve({
    en,
    es,
    id,
    internalId: record.id,
    order: record.get('order') as Story['order'],
    photos,
    year: record.get('year') as Story['year'],
    show: record.get('show') as Story['show'],
    cardPosition: record.get('cardPosition') as Story['cardPosition'],
  });
};

interface Linked {
  photos: Story['photos'];
}

const getLinkedRecords = async (storyId: Story['id']): Promise<Linked> => {
  const photos = await photoApi.findByStoryId(storyId);

  return {
    photos: photos.sort((a, b) => a.order - b.order),
  };
};

const airtable = new Airtable<Story>(TABLE, map);

const api: API<Story> = {
  find: async (id: string): Promise<Story> => await airtable.find(id),
  list: async (): Promise<Story[]> =>
    (await airtable.selectAll()).sort((a, b) => a.order - b.order),
};

export default api;
