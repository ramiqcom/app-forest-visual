import Image, { StaticImageData } from 'next/image';
import { useContext } from 'react';
import { Context } from '../module/store';
import { Select } from './input';

export default function Panel({ images }: { images: Record<string, StaticImageData> }) {
  const { status } = useContext(Context);
  const { eu, s4g } = images;

  return (
    <div id='panel' className='flexible vertical wide'>
      <div className='flexible vertical big-gap'>
        <div className='title'>INNO4CFIs Work Package 4 Output</div>

        <div className='flexible vertical gap'>
          <Location />
          <Period />
          <Layer />
          <div className='status'>{status?.text}</div>
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
  const { locations, location, setLocation, showPlot, setShowPlot, status } = useContext(Context);

  return (
    <div className='flexible vertical'>
      Select a location
      <div className='flexible'>
        <input
          type='checkbox'
          style={{ width: '10%' }}
          checked={showPlot}
          disabled={status?.status == 'process' || !locations?.length}
          onChange={(e) => setShowPlot(e.target.checked)}
        />
        <Select
          options={locations}
          value={location}
          disabled={status?.status == 'process' || !locations?.length}
          onChange={(value) => setLocation(value)}
        />
      </div>
    </div>
  );
}

function Period() {
  const { periods, period, setPeriod, status } = useContext(Context);

  return (
    <div className='flexible vertical'>
      Select period
      <Select
        options={periods}
        disabled={status?.status == 'process' || !periods?.length}
        value={period}
        onChange={(value) => setPeriod(value)}
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
