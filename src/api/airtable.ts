import airtable, { FieldSet, Record, Table } from 'airtable';
import { Attachment } from 'airtable/lib/attachment';
import { QueryParams } from 'airtable/lib/query_params';
import config from '../config';

const view = 'web';

type Map<T> = (record: AirtableRecord) => Promise<T>;
export interface BaseRecord {
  id: string | number;
  internalId: string;
}

export type AirtableRecord = Record<FieldSet>;

export interface AirtableImageAttachment extends Attachment {
  height: number;
  width: number;
}

type AirtableField = boolean | number | string | undefined | string[];

export interface AirtableCreateRecord<T> {
  fields: {
    [key: string]: AirtableField;
  };
}

export enum ERRORS {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

class Airtable<T extends BaseRecord> {
  private base: Table<FieldSet>;
  private map: Map<T>;
  // @TODO: Review argument type
  private toRecord?: (item: {
    [key: string]: AirtableField;
  }) => AirtableCreateRecord<T>;

  constructor(
    table: string,
    map: Map<T>,
    toRecord?: (item: {
      [key: string]: AirtableField;
    }) => AirtableCreateRecord<T>,
  ) {
    this.base = airtable.base(config.airtable.base)(table);
    this.map = map;
    this.toRecord = toRecord;
  }

  create = async (
    item: Partial<T> & { [key: string]: AirtableField },
  ): Promise<T['id']> => {
    if (!this.toRecord) {
      return Promise.reject('[Airtable - create] toRecord undefined');
    }

    const records: AirtableCreateRecord<T>[] = [this.toRecord(item)];

    return new Promise((resolve, reject) => {
      this.base.create(records, (error, records) => {
        if (error) {
          console.error(error);
          reject(error);
          return;
        }

        const id: T['id'] = records[0].get('id') as T['id'];

        resolve(id);
      });
    });
  };

  find = async (id: string | number): Promise<T> => {
    const params: QueryParams<FieldSet> = {
      filterByFormula: `id = '${id}'`,
      view,
    };

    return new Promise((resolve, reject) => {
      this.base.select(params).firstPage(async (error, records) => {
        if (error) {
          console.error('[Airtable - get] Error', error);
          reject(ERRORS.INTERNAL_ERROR);
        }

        if (records && records.length) {
          resolve(await this.map(records[0]));
        } else {
          reject(ERRORS.NOT_FOUND);
        }
      });
    });
  };

  findByField = async (field?: string, value?: string): Promise<T[]> => {
    const params: QueryParams<FieldSet> = {
      ...(field && value && { filterByFormula: `${field} = '${value}'` }),
      view,
    };

    return new Promise((resolve, reject) => {
      let items: T[] = [];

      this.base.select(params).eachPage(
        async (records, fetchNextPage) => {
          const newItems = await Promise.all(
            records.map(record => this.map(record)),
          );
          items = [...items, ...newItems];
          fetchNextPage();
        },
        error => {
          if (error) {
            console.error('[Airtable - selectAll] Error', error);
            reject(error);
          }
          resolve(items);
        },
      );
    });
  };

  selectAll = async (): Promise<T[]> => this.findByField();
}

export default Airtable;
