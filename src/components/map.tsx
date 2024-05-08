import { bbox, Feature, featureCollection, FeatureCollection } from '@turf/turf';
import { LngLatBoundsLike, Map, Popup, RasterTileSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useContext, useEffect, useState } from 'react';
import layers from '../data/layer.json';
import plots from '../data/location_geojson.json';
import { Context } from '../module/store';
import { LayerOutput } from '../module/type';

export default function MapCanvas() {
  const { layer, location, period, url, setLoading, showImage, showPlot, setVis } =
    useContext(Context);

  const rasterId = 'image';
  const plotId = 'plot';
  const [map, setMap] = useState<Map>();
  const mapDiv = 'map';
  const keyStadia = process.env.NEXT_PUBLIC_STADIA_KEY;
  const style = `https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json?api_key=${keyStadia}`;

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
          'fill-color': 'cyan',
          'fill-opacity': 0.3,
        },
      });

      // Body to load earth engine tile
      const body = {
        layer: layer.value,
        location: location.value,
        period: period.value,
      };

      // Fetch the tile
      const res = await fetch('/layer', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Get the tile
      const { url, vis }: LayerOutput = await res.json();

      // Set visualization
      vis.name = layer.label;
      vis.unit = layers.filter((data) => data.value == layer.value)[0].unit;
      setVis(vis);

      // Show the map
      setLoading(false);

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

      // Get the geojson bbox
      const bounds = bbox(
        featureCollection(
          plots.features.filter((feat) => feat.properties.location == location.label) as Feature[],
        ),
      ) as LngLatBoundsLike;
      map.fitBounds(bounds, { padding: 100 });
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
    if (map && url) {
      const source = map.getSource(rasterId) as RasterTileSource;
      source.setTiles([url]);
    }
  }, [map, url]);

  useEffect(() => {
    if (map && location.label) {
      // Get the geojson bbox
      const bounds = bbox(
        featureCollection(
          plots.features.filter((feat) => feat.properties.location == location.label) as Feature[],
        ),
      ) as LngLatBoundsLike;
      map.fitBounds(bounds, { padding: 100 });
    }
  }, [map, location]);

  useEffect(() => {
    if (map && map.getLayer(plotId)) {
      map.setLayoutProperty(plotId, 'visibility', showPlot ? 'visible' : 'none');
    }
  }, [map, showPlot]);

  useEffect(() => {
    if (map && map.getLayer(rasterId)) {
      map.setLayoutProperty(rasterId, 'visibility', showImage ? 'visible' : 'none');
    }
  }, [map, showImage]);

  return (
    <div
      className='flexible vertical center1 center2 center3'
      style={{ width: '100%', height: '100%' }}
    >
      <div id={mapDiv}></div>
    </div>
  );
}
