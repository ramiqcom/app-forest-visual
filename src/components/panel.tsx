import s4g from '@/image/s4glogowhite.png';
import { Context } from '@/module/store';
import Image from 'next/image';
import { useContext } from 'react';
import { Select } from './input';

export default function Panel() {
  const { status } = useContext(Context);

  return (
    <div id='panel' className='flexible vertical wide'>
      <div className='flexible vertical big-gap'>
        <div className='title'>Forest Data Visualization</div>

        <div className='flexible vertical gap'>
          <Region />
          <Year />
          <Layer />
          <div className='status'>{status?.text}</div>
        </div>
      </div>

      <div className='flexible wide gap center1 center2'>
        <Image src={s4g} alt='Space4Good' width={300} style={{ width: '25%', height: 'auto' }} />
      </div>
    </div>
  );
}

function Region() {
  const { collection, region, setRegion, regions, year, setYear, setYears, status, setStatus } =
    useContext(Context);

  return (
    <div className='flexible vertical'>
      Select a location
      <div className='flexible'>
        <Select
          options={regions}
          value={region}
          disabled={status?.status == 'process' || !regions?.length}
          onChange={async (value) => {
            try {
              setRegion(value);
              setStatus({ text: 'Loading periods...', status: 'process' });

              const regionData = collection.filter((dict) => dict.region.value == region.value)[0];

              const years = regionData.years;
              setYears(years);

              if (!years.filter((x) => x.value == year.value).length) {
                setYear(years[0]);
              }

              setStatus({ text: 'Years loaded', status: 'success' });
            } catch ({ message }) {
              setStatus({ text: message, status: 'failed' });
            }
          }}
        />
      </div>
    </div>
  );
}

function Year() {
  const {
    collection,
    years,
    year,
    setYear,
    status,
    setStatus,
    setLayer,
    setLayers,
    region,
    layer,
  } = useContext(Context);

  return (
    <div className='flexible vertical'>
      Select period
      <Select
        options={years}
        disabled={status?.status == 'process' || !years?.length}
        value={year}
        onChange={async (value) => {
          try {
            setYear(value);
            setStatus({ text: 'Loading layers...', status: 'process' });

            const regionData = collection.filter((dict) => dict.region.value == region.value)[0];
            const layers = regionData.layers;
            setLayers(layers);

            if (!layers.filter((x) => x.value == layer.value).length) {
              setLayer(layers[0]);
            }

            setStatus({ text: 'Layers loaded', status: 'success' });
          } catch ({ message }) {
            setStatus({ text: message, status: 'failed' });
          }
        }}
      />
    </div>
  );
}

function Layer() {
  const { layer, layers, setShowImage, showImage, setLayer, status } = useContext(Context);

  return (
    <div className='flexible vertical'>
      Select layer type
      <div className='flexible'>
        <input
          type='checkbox'
          style={{ width: '10%' }}
          checked={showImage}
          disabled={status?.status == 'process' || !layers?.length}
          onChange={(e) => setShowImage(e.target.checked)}
        />

        <Select
          options={layers}
          value={layer}
          disabled={status?.status == 'process' || !layers?.length}
          onChange={(value) => setLayer(value)}
        />
      </div>
    </div>
  );
}
