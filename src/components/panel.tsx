import { useContext } from 'react';
import periodsDict from '../data/period.json';
import { Context } from '../module/store';
import { Select } from './input';

export default function Panel() {
  return (
    <div id='panel' className='flexible vertical big-gap'>
      <div className='title'>INNO4CFIs Work Package 4 Output</div>

      <div className='flexible vertical gap'>
        <Location />
        <Period />
        <Layer />
        <ShowLayer />
      </div>
    </div>
  );
}

function Location() {
  const { locations, location, setLocation, setPeriods, setPeriod } = useContext(Context);

  return (
    <div className='flexible vertical'>
      Select a location
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
  const { layers, layer, setLayer } = useContext(Context);

  return (
    <div className='flexible vertical'>
      Select layer type
      <Select options={layers} value={layer} onChange={(value) => setLayer(value)} />
    </div>
  );
}

function ShowLayer() {
  return (
    <div className='flexible vertical'>
      <button>Show Layer</button>
    </div>
  );
}
