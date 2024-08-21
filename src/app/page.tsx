export const dynamic = 'force-dynamic';

import App from '@/components/main';
import typeDict from '@/data/layer-type.json';
import { loadImagedb, loadLayersDb, loadLocationsDb, loadPeriodsDb } from '@/module/database';

export default async function Home() {
  const locations = await loadLocationsDb();
  const location = locations[0];
  const periods = await loadPeriodsDb({ location: location.value as string });
  const period = periods[0];
  const layers = await loadLayersDb({ location: location.value, period: period.value });
  const layer = layers[0];

  // Get image url
  loadImagedb({
    location: location.value as string,
    period: period.value as string,
    type: typeDict[layer.value] as string,
  }).then((url) => fetch(`${process.env.TITILER_ENDPOINT}/cog/info?url=${url}`));

  return (
    <>
      <App
        defaultStates={{
          locations,
          location,
          periods,
          period,
          layers,
          layer,
        }}
      />
    </>
  );
}
