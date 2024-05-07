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

export default function App({ image }) {
  const [location, setLocation] = useState<Option>(locations[0]);
  const [periods, setPeriods] = useState<Options>(periodsDict[location.value]);
  const [period, setPeriod] = useState<Option>(periods[0]);
  const [layer, setLayer] = useState<Option>(layers[0]);
  const [url, setUrl] = useState<string>();
  const [vis, setVis] = useState<VisObject>();
  const [bounds, setBounds] = useState<LngLatBoundsLike>();

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
        <MapCanvas image={image} />
        <Panel />
      </Context.Provider>
    </>
  );
}
