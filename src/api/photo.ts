import { Attachment } from 'airtable/lib/attachment';
import { API } from '.';
import Airtable, { AirtableImageAttachment, AirtableRecord } from './airtable';
import { Story } from './story';

const TABLE = 'photo';

interface PhotoAPI extends API<Photo> {
  findByStoryId: (storyId: Story['id']) => Promise<Photo[]>;
}

export interface Photo {
  id: string;
  image: Image;
  order: number;
}

export interface Image {
  orientation: 'horizontal' | 'square' | 'vertical';
  thumbnails: {
    full: string;
    large: string;
    small: string;
  };
  url: string;
}

const mapImage = (image: AirtableImageAttachment): Image => {
  const { thumbnails } = image;

  return {
    orientation:
      image.height === image.width
        ? 'square'
        : image.height > image.width
        ? 'vertical'
        : 'horizontal',
    thumbnails: {
      full: thumbnails.full.url,
      large: thumbnails.large.url,
      small: thumbnails.small.url,
    },
    url: image.url,
  };
};

const map = (record: AirtableRecord): Promise<Photo> => {
  const image = record.get('image')[0] as AirtableImageAttachment;

  return Promise.resolve({
    id: record.get('id') as string,
    image: mapImage(image),
    order: record.get('order') as number,
  });
};

const airtable = new Airtable<Photo>(map, TABLE);

const api: PhotoAPI = {
  find: async (id: string): Promise<Photo> => await airtable.find(id),
  findByStoryId: async (storyId: string): Promise<Photo[]> => {
    return airtable.findByField('storyId', storyId);
  },
  list: async (): Promise<Photo[]> => await airtable.selectAll(),
};

export default api;
