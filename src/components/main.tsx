'use client';

import { Map } from 'maplibre-gl';
import { StaticImageData } from 'next/image';
import { useState } from 'react';
import layers from '../data/layer.json';
import locations from '../data/location.json';
import periodsDict from '../data/period.json';
import { Context } from '../module/store';
import { Option, Options, VisObject } from '../module/type';
import Legend from './legend';
import MapCanvas from './map';
import Panel from './panel';

export default function App({ images }: { images: Record<string, StaticImageData> }) {
  const [map, setMap] = useState<Map>();
  const [location, setLocation] = useState<Option>(locations[0]);
  const [periods, setPeriods] = useState<Options>(periodsDict[location.value]);
  const [period, setPeriod] = useState<Option>(periods[0]);
  const [layer, setLayer] = useState<Option>(layers[0]);

  const [url, setUrl] = useState<string>();
  const [vis, setVis] = useState<VisObject>();
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
  };

  return (
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
      <Panel images={images} />
    </Context.Provider>
  );
}
