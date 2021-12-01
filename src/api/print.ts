import { API } from '.';
import { omit } from 'lodash';
import Airtable, { AirtableRecord } from './airtable';

import photoApi, { Photo } from './photo';

const TABLE = 'print';

export interface Print {
  currency: 'usd' | 'pesos';
  height: number;
  id: number;
  internalId: string;
  photo: Photo;
  price: number;
  quantity: number;
  width: number;
}

export interface PrintRecord
  extends Omit<Print, 'id' | 'photo' | 'internalId'> {
  photoId: Print['photo']['id'];
}

const map = async (record: AirtableRecord): Promise<Print> => {
  const id = record.get('id') as number;
  const photoId = record.get('photoId') as Photo['id'];
  const { photo } = await getLinkedRecords(photoId);

  return Promise.resolve({
    currency: record.get('currency') as Print['currency'],
    height: record.get('height') as Print['height'],
    id,
    internalId: record.id,
    photo,
    price: record.get('price') as Print['price'],
    quantity: record.get('quantity') as Print['quantity'],
    width: record.get('width') as Print['width'],
  });
};

const toRecord = (print: any) => ({
  fields: {
    ...omit(print, ['id', 'photo', 'photoId']),
    photo: [print.photoId],
  },
});

interface Linked {
  photo: Print['photo'];
}

const getLinkedRecords = async (photoId: Photo['id']): Promise<Linked> => {
  const photo = await photoApi.find(photoId);

  return {
    photo,
  };
};

const airtable = new Airtable<Print>(TABLE, map, toRecord);

const api: Pick<API<Print>, 'create' | 'find' | 'list'> = {
  create: async (print: Omit<PrintRecord, 'id'>): Promise<Print['id']> =>
    await airtable.create(print),
  find: async (id: Print['id']): Promise<Print> => await airtable.find(id),
  list: async (): Promise<Print[]> => await airtable.selectAll(),
};

export default api;
