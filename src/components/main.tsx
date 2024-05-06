'use client';

import { LngLatBoundsLike } from 'maplibre-gl';
import { useState } from 'react';
import layers from '../data/layer.json';
import locations from '../data/location.json';
import periodsDict from '../data/period.json';
import { Context } from '../module/store';
import { Option, Options, VisObject } from '../module/type';
import MapCanvas from './map';
import Panel from './panel';

export default function App({
  defaultStates,
}: {
  defaultStates: {
    location: Option;
    layer: Option;
    url: string;
    vis: VisObject;
    bounds: LngLatBoundsLike;
  };
}) {
  const [location, setLocation] = useState<Option>(defaultStates.location);
  const [periods, setPeriods] = useState<Options>(periodsDict[location.value]);
  const [period, setPeriod] = useState<Option>(periods[0]);
  const [layer, setLayer] = useState<Option>(defaultStates.layer);
  const [url, setUrl] = useState<string>(defaultStates.url);
  const [vis, setVis] = useState<VisObject>(defaultStates.vis);
  const [bounds, setBounds] = useState<LngLatBoundsLike>(defaultStates.bounds);

  const states = {
    locations,
    location,
    setLocation,
    periods,
    setPeriods,
    period,
    setPeriod,
    layers,
    layer,
    setLayer,
    url,
    setUrl,
    vis,
    setVis,
    bounds,
    setBounds,
  };

  return (
    <>
      <Context.Provider value={states}>
        <MapCanvas />
        <Panel />
      </Context.Provider>
    </>
  );
}
