import { API } from '.';
import Airtable, { AirtableImageAttachment, AirtableRecord } from './airtable';
import { Story } from './story';

const TABLE = 'photo';

interface PhotoAPI extends API<Photo> {
  findByStoryId: (storyId: Story['id']) => Promise<Photo[]>;
}

export interface Photo {
  background: string;
  id: string;
  image: Image;
  internalId: string;
  order: number;
}

export interface Image {
  height: number;
  orientation: 'horizontal' | 'square' | 'vertical';
  url: string;
  width: number;
}

const mapImage = (image: AirtableImageAttachment): Image => ({
  height: image.height,
  orientation:
    image.height === image.width
      ? 'square'
      : image.height > image.width
      ? 'vertical'
      : 'horizontal',
  url: image.url,
  width: image.width,
});

const map = (record: AirtableRecord): Promise<Photo> => {
  const image = record.get('image')[0] as AirtableImageAttachment;

  const id = record.get('id') as string;

  return Promise.resolve({
    background: record.get('background') as string,
    id,
    internalId: record.id,
    image: mapImage(image),
    order: record.get('order') as number,
  });
};

const airtable = new Airtable<Photo>(TABLE, map);

const api: PhotoAPI = {
  find: async (id: string): Promise<Photo> => await airtable.find(id),
  findByStoryId: async (storyId: string): Promise<Photo[]> => {
    return airtable.findByField('storyId', storyId);
  },
  list: async (): Promise<Photo[]> => await airtable.selectAll(),
};

export default api;
