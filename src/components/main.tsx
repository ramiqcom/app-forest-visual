'use client';

import { FeatureCollection } from '@turf/turf';
import { Map } from 'maplibre-gl';
import { useState } from 'react';
import layers from '../data/layer.json';
import locations from '../data/location.json';
import { Context } from '../module/store';
import { Option, Options, VisObject } from '../module/type';
import Legend from './legend';
import MapCanvas from './map';
import Panel from './panel';

export default function App({
  defaultStates,
}: {
  defaultStates: {
    location: Option;
    periods: Options;
    period: Option;
    layer: Option;
    url: string;
    vis: VisObject;
    plots: FeatureCollection<any>;
  };
}) {
  const [map, setMap] = useState<Map>();
  const [location, setLocation] = useState<Option>(defaultStates.location);
  const [periods, setPeriods] = useState<Options>(defaultStates.periods);
  const [period, setPeriod] = useState<Option>(defaultStates.period);
  const [layer, setLayer] = useState<Option>(defaultStates.layer);
  const [url, setUrl] = useState<string>(defaultStates.url);
  const [vis, setVis] = useState<VisObject>(defaultStates.vis);
  const [showPlot, setShowPlot] = useState(true);
  const [showImage, setShowImage] = useState(true);

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
    showPlot,
    setShowPlot,
    showImage,
    setShowImage,
    map,
    setMap,
    plots: defaultStates.plots,
  };

  return (
    <>
      <Context.Provider value={states}>
        {vis ? (
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
        ) : null}

        <MapCanvas />
        <Panel />
      </Context.Provider>
    </>
  );
}
