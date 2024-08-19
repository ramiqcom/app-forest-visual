export const dynamic = 'force-dynamic';

import App from '@/components/main';
import { loadLayersDb, loadLocationsDb, loadPeriodsDb } from '@/module/database';
import { setTimeout } from 'timers/promises';

export default async function Home() {
  // Awake the titiler
  await fetch(`${process.env.TITILER_ENDPOINT}`);

  // Timeout 1 second to wait for the server
  await setTimeout(1000);

  const locations = await loadLocationsDb();
  const location = locations[0];
  const periods = await loadPeriodsDb({ location: location.value as string });
  const period = periods[0];
  const layers = await loadLayersDb({ location: location.value, period: period.value });
  const layer = layers[0];

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
