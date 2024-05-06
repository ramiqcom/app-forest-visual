import App from '../components/main';
import layers from '../data/layer.json';
import locations from '../data/location.json';
import periodsDict from '../data/period.json';
import { loadLayer } from '../module/layer';

export default async function Home() {
  const location = locations[0];
  const period = periodsDict[location.value][0];
  const layer = layers[0];
  const body = {
    location: location.value,
    period: period.value,
    layer: layer.value,
  };
  const { url, vis, bounds } = await loadLayer(body);

  return (
    <>
      <App defaultStates={{ location, layer, url, vis, bounds }} />
    </>
  );
}
