import Image, { StaticImageData } from 'next/image';
import { useContext, useState } from 'react';
import layers from '../data/layer.json';
import periodsDict from '../data/period.json';
import { Context } from '../module/store';
import { LayerOutput } from '../module/type';
import { Select } from './input';

export default function Panel({ images }: { images: Record<string, StaticImageData> }) {
  const { eu, s4g } = images;

  return (
    <div id='panel' className='flexible vertical wide'>
      <div className='flexible vertical big-gap'>
        <div className='title'>INNO4CFIs Work Package 4 Output</div>

        <div className='flexible vertical gap'>
          <Location />
          <Period />
          <Layer />
          <ShowLayer />
        </div>
      </div>

      <div className='flexible wide gap center1'>
        <div className='flexible vertical text-center' style={{ fontSize: 'x-small' }}>
          <Image
            src={eu}
            alt='European Union'
            width={300}
            style={{ width: '100%', height: 'auto' }}
          />
          GA 101115156
        </div>
        <Image src={s4g} alt='Space4Good' width={300} style={{ width: '25%', height: 'auto' }} />
      </div>
    </div>
  );
}

function Location() {
  const { locations, location, setLocation, setPeriods, setPeriod, showPlot, setShowPlot } =
    useContext(Context);

  return (
    <div className='flexible vertical'>
      Select a location
      <div className='flexible'>
        <input
          type='checkbox'
          style={{ width: '10%' }}
          checked={showPlot}
          onChange={(e) => setShowPlot(e.target.checked)}
        />
        <Select
          options={locations}
          value={location}
          onChange={(value) => {
            setLocation(value);

            const periods = periodsDict[value.value];
            setPeriods(periods);
            setPeriod(periods[0]);
          }}
        />
      </div>
    </div>
  );
}

function Period() {
  const { periods, period, setPeriod } = useContext(Context);

  return (
    <div className='flexible vertical'>
      Select period
      <Select options={periods} value={period} onChange={(value) => setPeriod(value)} />
    </div>
  );
}

function Layer() {
  const { layers, layer, setLayer, showImage, setShowImage } = useContext(Context);

  return (
    <div className='flexible vertical'>
      Select layer type
      <div className='flexible'>
        <input
          type='checkbox'
          style={{ width: '10%' }}
          checked={showImage}
          onChange={(e) => setShowImage(e.target.checked)}
        />
        <Select options={layers} value={layer} onChange={(value) => setLayer(value)} />
      </div>
    </div>
  );
}

function ShowLayer() {
  const { location, layer, period, setUrl, setVis } = useContext(Context);

  const [status, setStatus] = useState<string>(undefined);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  return (
    <div className='flexible vertical gap'>
      <button
        disabled={buttonDisabled}
        onClick={async () => {
          try {
            setButtonDisabled(true);
            setStatus('Generating image...');

            const body = {
              layer: layer.value,
              location: location.value,
              period: period.value,
            };

            const res = await fetch('/layer', {
              method: 'POST',
              body: JSON.stringify(body),
              headers: {
                'Content-Type': 'application/json',
              },
            });

            const { url, message, vis }: LayerOutput = await res.json();

            if (!res.ok) {
              throw new Error(message);
            }

            setUrl(url);

            // Set visualization
            vis.name = layer.label;
            vis.unit = layers.filter((data) => data.value == layer.value)[0].unit;
            setVis(vis);

            setStatus('Success');
          } catch ({ message }) {
            setStatus(message);
          } finally {
            setButtonDisabled(false);
          }
        }}
      >
        Show Layer
      </button>

      <div className='status'>{status}</div>
    </div>
  );
}
