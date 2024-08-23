'use client';

import { Context } from '@/module/store';
import { Collection, Option, Options, Status } from '@/module/type';
import { useState } from 'react';
import Legend from './legend';
import MapCanvas from './map';
import Panel from './panel';

export default function App({
  defaultStates,
}: {
  defaultStates: {
    collection: Collection;
    regions: Options;
    region: Option;
    years: Options;
    year: Option;
    layers: Options;
    layer: Option;
  };
}) {
  const [regions, setRegions] = useState<Options>(defaultStates.regions);
  const [region, setRegion] = useState<Option>(defaultStates.region);
  const [years, setYears] = useState<Options>(defaultStates.years);
  const [year, setYear] = useState<Option>(defaultStates.year);
  const [layers, setLayers] = useState<Options>(defaultStates.layers);
  const [layer, setLayer] = useState<Option>(defaultStates.layer);

  const [showImage, setShowImage] = useState(true);

  const [status, setStatus] = useState<Status>();

  const states = {
    collection: defaultStates.collection,
    regions,
    setRegions,
    region,
    setRegion,
    years,
    setYears,
    year,
    setYear,
    layer,
    setLayer,
    layers,
    setLayers,
    showImage,
    setShowImage,
    status,
    setStatus,
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
