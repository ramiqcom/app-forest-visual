'use server';

import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import { GoogleAuth } from 'google-auth-library';
import { Pool } from 'pg';
import { loadPrivateKey } from './server';
import { Options } from './type';

async function dbClient(): Promise<Pool> {
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

  return rows as Options;
}

export async function loadPeriodsDb({ location }: { location: string }): Promise<Options> {
  const client = await dbClient();

  const query = `
		SELECT TO_CHAR(date, 'YYYY-MM-DD') as value, TO_CHAR(date, 'YYYY-MM-DD') as label FROM public.pleiades_image
		WHERE location='${location}';
	`;

  const { rows } = await client.query(query);

  return rows as Options;
}

export async function loadLayersDb({ location, period }) {
  const client = await dbClient();

  const query = `
		SELECT type FROM public.pleiades_image
		WHERE (location='${location}' AND date=DATE('${period}'));
	`;

  const { rows } = await client.query(query);

  // List of layers possible to produce
  let layers = [];

  // Conditional for layers that exist
  if (rows.length) {
    const types: string[] = rows.map((dict: Record<string, any>) => dict.type);

    if (types.includes('multispectral')) {
      layers = layers.concat([
        { label: 'True color', value: 'true_color' },
        { label: 'False color', value: 'false_color' },
        { label: 'NDVI', value: 'ndvi' },
        { label: 'NDWI', value: 'ndwi' },
      ]);
    }

    if (types.includes('forest')) {
      layers = layers.concat([
        { label: 'Tree height', value: 'chm' },
        { label: 'Tree density', value: 'treecover' },
        { label: 'Aboveground Biomass', value: 'agb' },
      ]);
    }

    if (types.includes('landcover')) {
      layers = layers.concat([{ label: 'Land cover', value: 'lc' }]);
    }
  }

  return layers as Options;
}

export async function loadImagedb({
  location,
  period,
  type,
}: {
  location: string;
  period: string;
  type: string;
}) {
  const client = await dbClient();

  const query = `
		SELECT url FROM public.pleiades_image
		WHERE (location='${location}' AND date=DATE('${period}') AND type='${type}');
	`;
  const { rows } = await client.query(query);

  return rows[0].url as string;
}

export async function loadBboxDb({ location }) {
  const client = await dbClient();

  const query = `
		SELECT
      ST_XMin(geo::geometry) as xmin,
      ST_YMin(geo::geometry) as ymin,
      ST_XMax(geo::geometry) as xmax,
      ST_YMax(geo::geometry) as ymax
    FROM public.location
    WHERE id='${location}';
	`;

  const { rows } = await client.query(query);

  return Object.values(rows[0]) as number[];
}
