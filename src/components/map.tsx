import plots from '@/data/location_geojson.json';
import visParams from '@/data/titiler-vis.json';
import { loadBboxDb, loadImagedb } from '@/module/database';
import { loadStadiaKey } from '@/module/server';
import { Context } from '@/module/store';
import { FeatureCollection } from '@turf/turf';
import { LngLatBoundsLike, Map, Popup, RasterTileSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useContext, useEffect, useState } from 'react';

export default function MapCanvas() {
  const { location, period, layer, showPlot, showImage, setStatus } = useContext(Context);

  const [map, setMap] = useState<Map>();
  const [loaded, setLoaded] = useState(false);
  const rasterId = 'image';
  const plotId = 'plot';
  const mapDiv = 'map';

  // Async function to load map for the first time
  async function loadMap() {
    try {
      setStatus({ text: 'Loading map...', status: 'process' });

      const keyStadia = await loadStadiaKey();

      const map = new Map({
        container: mapDiv,
        style: `https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json?api_key=${keyStadia}`,
      });
      setMap(map);

      // When the map is mounted load the image
      map.on('load', async () => {
        // Load vector
        map.addSource(plotId, {
          type: 'geojson',
          data: plots as FeatureCollection<any>,
        });
        map.addLayer({
          source: plotId,
          type: 'fill',
          id: plotId,
          paint: {
            'fill-color': '#00000000',
            'fill-outline-color': 'red',
          },
        });

        // Make the map as loaded
        setLoaded(true);
      });

      // On click map
      map.on('click', plotId, (e) => {
        const array = e.lngLat.toArray();
        const description = e.features[0].properties;
        const keys = Object.keys(description);
        const divData = keys
          .map((key) => `<div class='flexible small-gap'>${key}: ${description[key]}</div>`)
          .join('\n');
        new Popup()
          .setLngLat(array)
          .setHTML(
            `<div class='flexible vertical' style='background-color: #181a1b; margin: 0; padding: 1vh'>${divData}</div>`,
          )
          .addTo(map);
      });

      setStatus({ text: 'Map loaded', status: 'success' });
    } catch ({ message }) {
      setStatus({ text: message, status: 'failed' });
    }
  }

  // Async function to get url or bounds of the image
  async function loadImage({
    layer,
    location,
    period,
  }: {
    layer: string;
    location: string;
    period: string;
  }) {
    try {
      setStatus({ text: 'Loading image...', status: 'process' });
      const typeDict = {
        true_color: 'multispectral',
        false_color: 'multispectral',
        ndvi: 'multispectral',
        ndwi: 'multispectral',
        chm: 'forest',
        treecover: 'forest',
        agb: 'forest',
        lc: 'landcover',
      };

      // Get image url
      const url = await loadImagedb({ location, period, type: typeDict[layer] });
      console.log(url);

      // Get image bounds
      const bounds = await (await fetch(`cog/bounds?url=${url}`)).json();
      console.log(bounds);

      // Visualization parameter
      const vis: string = visParams[layer].param;

      // Image full url
      const fullUrl = `/cog/tiles/{z}/{x}/{y}.png?url=${url}&${vis}`;
      console.log(fullUrl);

      // Add image to map
      if (map.getSource(rasterId)) {
        const source = map.getSource(rasterId) as RasterTileSource;
        source.setTiles([fullUrl]);
        source.bounds = bounds;
      } else {
        map.addSource(rasterId, {
          type: 'raster',
          tiles: [fullUrl],
          tileSize: 128,
          bounds: bounds,
        });
        map.addLayer(
          {
            type: 'raster',
            source: rasterId,
            id: rasterId,
            minzoom: 0,
            maxzoom: 20,
          },
          map.getSource(plotId) ? plotId : null,
        );
      }

      setStatus({ text: 'Image loaded', status: 'success' });
    } catch ({ message }) {
      setStatus({ text: message, status: 'failed' });
    }
  }

  // Zoom to location function
  async function ZoomToLocation({ location }) {
    try {
      setStatus({ text: 'Zooming to location...', status: 'process' });
      const bbox = await loadBboxDb({ location });
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
    if (loaded && layer && location && period) {
      // Loading image if layer and everything is loaded
      loadImage({
        layer: layer.value as string,
        location: location.value as string,
        period: period.value as string,
      });
    }
  }, [loaded, location, period, layer]);

  useEffect(() => {
    if (loaded && location) {
      ZoomToLocation({ location: location.value });
    }
  }, [loaded, location]);

  useEffect(() => {
    if (loaded && map.getLayer(plotId)) {
      map.setLayoutProperty(plotId, 'visibility', showPlot ? 'visible' : 'none');
    }
  }, [loaded, showPlot]);

  useEffect(() => {
    if (loaded && map.getLayer(rasterId)) {
      map.setLayoutProperty(rasterId, 'visibility', showImage ? 'visible' : 'none');
    }
  }, [loaded, showImage]);

  return (
    <div
      className='flexible vertical center1 center2 center3'
      style={{ width: '100%', height: '100%' }}
    >
      <div id={mapDiv}></div>
    </div>
  );
}
