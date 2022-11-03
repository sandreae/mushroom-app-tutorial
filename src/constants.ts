import schemas from '../schemas.json';
import year from '../year.json';

// Run `npm run schema` and paste the resulting schema ids into `schemas.json`
export const KO_SCHEMA_ID = schemas.KO_SCHEMA_ID;
export const SEKKI_SCHEMA_ID = schemas.SEKKI_SCHEMA_ID;
export const YEAR_SCHEMA_ID = schemas.YEAR_SCHEMA_ID;

// URL of your local aquadoggo node
export const ENDPOINT = 'http://localhost:2020/graphql';

// The document id of the year we want to record
// Run `npm run year` and paste the resulting schema ids into `schemas.json`
export const YEAR_ID = year.YEAR_ID;
