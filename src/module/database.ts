'use server';

import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import { GoogleAuth } from 'google-auth-library';
import { Pool } from 'pg';
import { loadPrivateKey } from './key';
import { Options } from './type';

async function dbClient() {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/sqlservice.admin'],
  });

  const connector = new Connector({
    auth: auth.fromJSON(await loadPrivateKey()),
  });

  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME,
    authType: AuthTypes.PASSWORD,
    ipType: IpAddressTypes.PUBLIC,
  });

  const client = new Pool({
    ...clientOpts,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  return client;
}

export async function loadLocationsDb(): Promise<Options> {
  const client = await dbClient();

  const query = `
		SELECT id as value, name as label FROM public.location;
	`;

  const { rows } = await client.query(query);

  return rows;
}

export async function loadPeriodsDb(location: string): Promise<Options> {
  const client = await dbClient();

  const query = `
		SELECT TO_CHAR(date, 'YYYY-MM-DD') as value, TO_CHAR(date, 'YYYY-MM-DD') as label FROM public.pleiades_image
		WHERE location='${location}';
	`;

  const { rows } = await client.query(query);

  return rows;
}

export async function loadImagedb({
  location,
  date,
  type,
}: {
  location: string;
  date: string;
  type: string;
}) {
  const client = await dbClient();

  const query = `
		SELECT url FROM public.pleiades_image
		WHERE (location='${location}' AND date=DATE('${date}') AND type='${type}')
	`;
  const { rows } = await client.query(query);

  return rows;
}
