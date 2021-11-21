import * as dotenv from 'dotenv';

dotenv.config();

interface Config {
  airtable: {
    apiKey: string;
    base: string;
  };
  env: string;
  port: number;
}

const config: Config = {
  airtable: {
    apiKey: process.env.AIRTABLE_API_KEY,
    base: process.env.AIRTABLE_BASE,
  },
  env: process.env.ENV,
  port: Number(process.env.PORT),
};

export default config;
