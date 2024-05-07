'use client';

import { LngLatBoundsLike } from 'maplibre-gl';
import { useState } from 'react';
import layers from '../data/layer.json';
import locations from '../data/location.json';
import periodsDict from '../data/period.json';
import { Context } from '../module/store';
import { Option, Options, VisObject } from '../module/type';
import Loading from './loading';
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
  const [loading, setLoading] = useState(true);

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
    loading,
    setLoading,
  };

  return (
    <>
      <Context.Provider value={states}>
        {loading ? (
          <div style={{ zIndex: 99999, position: 'absolute', width: '100%', height: '100%' }}>
            <Loading image={image} />
          </div>
        ) : null}
        <MapCanvas />
        <Panel />
      </Context.Provider>
    </>
  );
}
