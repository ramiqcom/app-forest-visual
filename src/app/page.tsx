import { FeatureCollection } from '@turf/turf';
import { StaticImageData } from 'next/image';
import { Suspense } from 'react';
import Loading from '../components/loading';
import App from '../components/main';
import layers from '../data/layer.json';
import locations from '../data/location.json';
import plots from '../data/location_geojson.json';
import periodsDict from '../data/period.json';
import inno from '../image/INNO4CFIs.png';
import { loadLayer } from '../module/layer';
import eu from '../image/EN_Co-fundedbytheEU_RGB_WHITE-300x67.png';
import s4g from '../image/s4glogowhite.png';

export default async function Home() {
  // Parameter to get url
  const location = locations[0];
  const periods = periodsDict[location.value];
  const period = periods[0];
  const layer = layers[0];

  // Load layer
  const { url, vis } = await loadLayer({
    location: location.value,
    period: period.value,
    layer: layer.value,
  });

  // Set visualization
  vis.name = layer.label;
  vis.unit = layers.filter((data) => data.value == layer.value)[0].unit;

  return (
    <>
      <Suspense fallback={<LoadingPage image={inno} />}>
        <App
          images={{ s4g, eu }}
          defaultStates={{
            location,
            periods,
            period,
            layer,
            url,
            vis,
            plots: plots as FeatureCollection<any>,
          }}
        />
      </Suspense>
    </>
  );
}

function LoadingPage({ image }: { image: StaticImageData }) {
  return (
    <div style={{ zIndex: 99999, position: 'absolute', width: '100%', height: '100%' }}>
      <Loading image={image} />
    </div>
  );
}
