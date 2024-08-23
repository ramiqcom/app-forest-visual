export const dynamic = 'force-dynamic';

import App from '@/components/main';
import { loadCollectionDB } from '@/module/database';

export default async function Home() {
  const collection = await loadCollectionDB();

  const index = 0;
  const { years, layers } = collection[index];

  const regions = collection.map((dict) => dict.region);
  const region = regions[index];

  const year = years[0];
  const layer = layers[0];

  return (
    <>
      <App
        defaultStates={{
          collection,
          regions,
          region,
          years,
          year,
          layers,
          layer,
        }}
      />
    </>
  );
}
