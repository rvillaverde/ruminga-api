import airtable, { FieldSet, Record, Table } from 'airtable';
import { QueryParams } from 'airtable/lib/query_params';
import config from '../config';

const view = 'web';

type Map<T> = (record: AirtableRecord) => T;

export type AirtableRecord = Record<FieldSet>;

export enum ERRORS {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

class Airtable<T> {
  private base: Table<FieldSet>;
  private map: Map<T>;

  constructor(map: Map<T>, table: string) {
    this.base = airtable.base(config.airtable.base)(table);
    this.map = map;
  }

  get = async (id: string): Promise<T> => {
    const params: QueryParams<FieldSet> = {
      filterByFormula: `id = '${id}'`,
      view,
    };

    return new Promise((resolve, reject) => {
      this.base.select(params).firstPage((error, records) => {
        if (error) {
          console.error('[Airtable - get] Error', error);
          reject(ERRORS.INTERNAL_ERROR);
        }

        if (records && records.length) {
          resolve(this.map(records[0]));
        } else {
          reject(ERRORS.NOT_FOUND);
        }
      });
    });
  };

  selectAll = async (): Promise<T[]> =>
    new Promise((resolve, reject) => {
      let items: T[] = [];

      this.base.select({ view }).eachPage(
        (records, fetchNextPage) => {
          items = [...items, ...records.map(record => this.map(record))];
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
}

export default Airtable;
