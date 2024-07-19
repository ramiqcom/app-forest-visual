'use client';

import { loadLayersDb, loadLocationsDb, loadPeriodsDb } from '@/module/database';
import { Context } from '@/module/store';
import { Option, Options, Status } from '@/module/type';
import { useEffect, useState } from 'react';
import Legend from './legend';
import MapCanvas from './map';
import Panel from './panel';

export default function App() {
  const [locations, setLocations] = useState<Options>();
  const [location, setLocation] = useState<Option>();
  const [periods, setPeriods] = useState<Options>();
  const [period, setPeriod] = useState<Option>();
  const [layers, setLayers] = useState<Options>();
  const [layer, setLayer] = useState<Option>();

  const [showPlot, setShowPlot] = useState(true);
  const [showImage, setShowImage] = useState(true);

  const [status, setStatus] = useState<Status>();

  async function loadLocations() {
    try {
      setStatus({ text: 'Loading locations...', status: 'process' });
      const data = await loadLocationsDb();
      setLocations(data);

      if (!location) {
        setLocation(data[0]);
      }

      setStatus({ text: 'Locations loaded', status: 'success' });
    } catch ({ message }) {
      setStatus({ text: message, status: 'failed' });
    }
  }

  async function loadPeriods({ location }: { location: string }) {
    try {
      setStatus({ text: 'Loading periods...', status: 'process' });
      const data = await loadPeriodsDb({ location });
      setPeriods(data);

      if (!period) {
        setPeriod(data[0]);
      }

      setStatus({ text: 'Periods loaded', status: 'success' });
    } catch ({ message }) {
      setStatus({ text: message, status: 'failed' });
    }
  }

  async function loadLayers({ location, period }: { location: string; period: string }) {
    try {
      setStatus({ text: 'Loading layers...', status: 'process' });
      const data = await loadLayersDb({ location, period });
      setLayers(data);

      if (!layer) {
        setLayer(data[0]);
      }

      setStatus({ text: 'Layers loaded', status: 'success' });
    } catch ({ message }) {
      setStatus({ text: message, status: 'failed' });
    }
  }

  // First js to load the data
  useEffect(() => {
    loadLocations();
  }, []);

  // When the location change load the database again
  useEffect(() => {
    if (location?.value) {
      loadPeriods({ location: location.value as string });
    }
  }, [location]);

  // When the period change load what layers is available
  useEffect(() => {
    if (location?.value && period?.value) {
      loadLayers({ location: location.value as string, period: period.value as string });
    }
  }, [location, period]);

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
