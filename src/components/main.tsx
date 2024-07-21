'use client';

import { Context } from '@/module/store';
import { Option, Options, Status } from '@/module/type';
import { useState } from 'react';
import Legend from './legend';
import MapCanvas from './map';
import Panel from './panel';

export default function App({
  defaultStates,
}: {
  defaultStates: {
    locations: Options;
    location: Option;
    periods: Options;
    period: Option;
    layers: Options;
    layer: Option;
  };
}) {
  const [locations, setLocations] = useState<Options>(defaultStates.locations);
  const [location, setLocation] = useState<Option>(defaultStates.location);
  const [periods, setPeriods] = useState<Options>(defaultStates.periods);
  const [period, setPeriod] = useState<Option>(defaultStates.period);
  const [layers, setLayers] = useState<Options>(defaultStates.layers);
  const [layer, setLayer] = useState<Option>(defaultStates.layer);

  const [showPlot, setShowPlot] = useState(true);
  const [showImage, setShowImage] = useState(true);

  const [status, setStatus] = useState<Status>();

  const states = {
    location,
    setLocation,
    periods,
    setPeriods,
    period,
    setPeriod,
    layer,
    setLayer,
    showPlot,
    setShowPlot,
    showImage,
    setShowImage,
    status,
    setStatus,
    locations,
    setLocations,
    layers,
    setLayers,
  };

  return (
    <Context.Provider value={states}>
      <div
        style={{
          zIndex: 99999,
          position: 'absolute',
          padding: '2vh',
          marginTop: '2vh',
          marginLeft: '2vh',
          backgroundColor: '#181a1b',
          fontSize: 'small',
        }}
      >
        <Legend />
      </div>
      <MapCanvas />
      <Panel />
    </Context.Provider>
  );
}
