'use client';

import { loadLocationsDb, loadPeriodsDb } from '@/module/database';
import { StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';
import { Context } from '../module/store';
import { Option, Options } from '../module/type';
import Panel from './panel';

export default function App({ images }: { images: Record<string, StaticImageData> }) {
  const [locations, setLocations] = useState<Options>();
  const [location, setLocation] = useState<Option>();
  const [periods, setPeriods] = useState<Options>();
  const [period, setPeriod] = useState<Option>();
  const [layers, setLayers] = useState<Options>();
  const [layer, setLayer] = useState<Option>();

  const [showPlot, setShowPlot] = useState(true);
  const [showImage, setShowImage] = useState(true);

  const [status, setStatus] = useState<string>();

  async function loadLocations() {
    const data = await loadLocationsDb();
    setLocations(data);
    setLocation(data[0]);
  }

  async function loadPeriods(location: string) {
    const data = await loadPeriodsDb(location);
    setPeriods(data);
    setPeriod(data[0]);
  }

  // First js to load the data
  useEffect(() => {
    loadLocations();
  }, []);

  // When the location change load the database again
  useEffect(() => {
    if (location?.value) {
      loadPeriods(location.value as string);
    }
  }, [location]);

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
      {/* <div
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
      </div> */}
      {/* <MapCanvas /> */}
      <Panel images={images} />
    </Context.Provider>
  );
}
