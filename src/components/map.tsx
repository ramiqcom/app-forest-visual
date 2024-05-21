import { bbox, Feature, featureCollection, FeatureCollection } from '@turf/turf';
import { LngLatBoundsLike, Map, Popup, RasterTileSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useContext, useEffect, useState } from 'react';
import layers from '../data/layer.json';
import plots from '../data/location_geojson.json';
import { loadLayer } from '../module/layer';
import { Context } from '../module/store';

export default function MapCanvas() {
  const { location, url, period, setMap, map, showPlot, showImage, layer, setUrl, setVis } =
    useContext(Context);

  const rasterId = 'image';
  const [loaded, setLoaded] = useState(false);
  const plotId = 'plot';
  const mapDiv = 'map';
  const keyStadia = process.env.NEXT_PUBLIC_STADIA_KEY;
  const style = `https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json?api_key=${keyStadia}`;

  // Load url
  useEffect(() => {
    async function loadFirst() {
      const { url, vis } = await loadLayer({
        location: location.value as string,
        period: period.value as string,
        layer: layer.value as string,
      });

      // Set visualization
      vis.name = layer.label;
      vis.unit = layers.filter((data) => data.value == layer.value)[0].unit;

      // Set url and vis
      setUrl(url);
      setVis(vis);
    }
    loadFirst();
  }, []);

  useEffect(() => {
    const map = new Map({
      container: mapDiv,
      style,
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
  }, []);

  useEffect(() => {
    if (loaded && url) {
      if (map.getSource(rasterId)) {
        const source = map.getSource(rasterId) as RasterTileSource;
        source.setTiles([url]);
      } else {
        // Add image source
        map.addSource(rasterId, {
          type: 'raster',
          tiles: [url],
          tileSize: 128,
        });

        // Add the source as layer
        map.addLayer(
          {
            type: 'raster',
            source: rasterId,
            id: rasterId,
            maxzoom: 20,
            minzoom: 5,
          },
          plotId,
        );
      }
    }
  }, [loaded, url]);

  useEffect(() => {
    if (loaded && location.label) {
      // Get the geojson bbox
      const bounds = bbox(
        featureCollection(
          plots.features.filter((feat) => feat.properties.location == location.label) as Feature[],
        ),
      ) as LngLatBoundsLike;
      map.fitBounds(bounds, { padding: 100 });
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
