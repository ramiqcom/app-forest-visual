import visParams from '@/data/titiler-vis.json';
import { Context } from '@/module/store';
import { LngLatBoundsLike, Map, RasterTileSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useContext, useEffect, useState } from 'react';

export default function MapCanvas() {
  const { collection, region, year, layer, showImage, setStatus } = useContext(Context);

  const [map, setMap] = useState<Map>();
  const [loaded, setLoaded] = useState(false);
  const rasterId = 'image';
  const mapDiv = 'map';

  // Async function to load map for the first time
  async function loadMap() {
    try {
      setStatus({ text: 'Loading map...', status: 'process' });

      const map = new Map({
        container: mapDiv,
        style: {
          version: 8,
          sources: {
            basemap: {
              type: 'raster',
              tiles: ['https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}'],
              tileSize: 256,
              attribution: 'Google Satellite Hybrid',
            },
          },
          layers: [
            {
              id: 'basemap',
              type: 'raster',
              source: 'basemap',
              minzoom: 0,
              maxzoom: 22,
            },
          ],
        },
        maxZoom: 18,
      });
      setMap(map);

      // When the map is mounted load the image
      map.on('load', async () => {
        // Make the map as loaded
        setLoaded(true);
      });
      setStatus({ text: 'Map loaded', status: 'success' });
    } catch ({ message }) {
      setStatus({ text: message, status: 'failed' });
    }
  }

  // Async function to get url or bounds of the image
  async function loadImage({
    layer,
    region,
    year,
  }: {
    layer: string;
    region: string;
    year: number;
  }) {
    try {
      setStatus({ text: 'Loading image...', status: 'process' });

      // Get image url
      const url = `https://storage.googleapis.com/gee-ramiqcom-s4g-bucket/vwc/data/${layer}_${region}_${year}.tif`;

      // Visualization parameter
      const vis: string = visParams[layer].param;

      // Image full url
      const fullUrl = `/cog/WebMercatorQuad/tilejson.json?url=${url}&${vis}`;

      // Add image to map
      if (map.getSource(rasterId)) {
        const source = map.getSource(rasterId) as RasterTileSource;
        source.setUrl(fullUrl);
      } else {
        map.addSource(rasterId, {
          type: 'raster',
          url: fullUrl,
          tileSize: 256,
        });
        map.addLayer({
          type: 'raster',
          source: rasterId,
          id: rasterId,
        });
      }

      setStatus({ text: 'Image loaded', status: 'success' });
    } catch ({ message }) {
      setStatus({ text: message, status: 'failed' });
    }
  }

  // Zoom to location function
  async function ZoomToLocation({ region }: { region: string }) {
    try {
      setStatus({ text: 'Zooming to location...', status: 'process' });
      const bbox = collection.filter((dict) => dict.region.value == region)[0].bounds;
      map.fitBounds(bbox as LngLatBoundsLike);
      setStatus({ text: 'Zoomed to location', status: 'success' });
    } catch ({ message }) {
      setStatus({ text: message, status: 'failed' });
    }
  }

  useEffect(() => {
    // Loading map for the first time
    loadMap();
  }, []);

  useEffect(() => {
    if (loaded && layer && location && region) {
      // Loading image if layer and everything is loaded
      loadImage({
        layer: layer.value as string,
        region: region.value as string,
        year: year.value as number,
      });
    }
  }, [loaded, region, year, layer]);

  useEffect(() => {
    if (loaded && map.getLayer(rasterId)) {
      map.setLayoutProperty(rasterId, 'visibility', showImage ? 'visible' : 'none');
    }
  }, [loaded, showImage]);

  useEffect(() => {
    if (loaded) {
      ZoomToLocation({ region: region.value as string });
    }
  }, [loaded, region]);

  return (
    <div
      className='flexible vertical center1 center2 center3'
      style={{ width: '100%', height: '100%' }}
    >
      <div id={mapDiv}></div>
    </div>
  );
}
