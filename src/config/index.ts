import * as dotenv from 'dotenv';

dotenv.config();

interface Config {
  airtable: {
    apiKey: string;
    base: string;
  };
}

const config: Config = {
  airtable: {
    apiKey: process.env.AIRTABLE_API_KEY,
    base: process.env.AIRTABLE_BASE,
  },
};

export default config;
