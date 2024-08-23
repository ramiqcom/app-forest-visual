'use server';

import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import { GoogleAuth } from 'google-auth-library';
import { Pool } from 'pg';
import { loadPrivateKey } from './server';
import { Collection, Options } from './type';

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

export async function loadCollectionDB(): Promise<Collection> {
  const client = await dbClient();

  const query = `
		SELECT
      code as value,
      CONCAT(label_region, ' - ', label_country) as label,
      years,
      layers,
      ST_XMin(bounds::geometry) as xmin,
      ST_YMin(bounds::geometry) as ymin,
      ST_XMax(bounds::geometry) as xmax,
      ST_YMax(bounds::geometry) as ymax
    FROM public.regions
    WHERE (array_length(years, 1) > 0 AND (array_length(layers, 1) > 0));
	`;

  const layersDict = {
    CHM: 'Canopy Height Model',
    treecover: 'Tree cover percentage',
    AGB: 'Above Ground Biomass',
  };

  let { rows } = await client.query(query);
  rows = rows.map((row: Record<string, any>) => {
    let { value, label, years, layers, xmin, ymin, xmax, ymax } = row;

    const region = { value, label };

    years = years.map(
      (year: number) => new Object({ value: year, label: String(year) }),
    ) as Options;

    layers = layers.map(
      (layer: string) => new Object({ value: layer, label: layersDict[layer] }),
    ) as Options;
    const bounds = [xmin, ymin, xmax, ymax];

    return { region, years, layers, bounds };
  });

  return rows as Collection;
}
