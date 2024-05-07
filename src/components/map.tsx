import { Map, RasterTileSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../module/store';
import { LayerOutput } from '../module/type';
import Loading from './loading';

export default function MapCanvas({ image }) {
  const { layer, location, period, url, bounds } = useContext(Context);

  const rasterId = 'image';
  const [map, setMap] = useState<Map>();
  const [loading, setLoading] = useState(true);
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
      const body = {
        layer: layer.value,
        location: location.value,
        period: period.value,
      };

      const res = await fetch('/layer', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { url, bounds }: LayerOutput = await res.json();

      // Show the map
      setLoading(false);

      // Add image source
      map.addSource(rasterId, {
        type: 'raster',
        tiles: [url],
        tileSize: 128,
      });

      // Add the source as layer
      map.addLayer({
        type: 'raster',
        source: rasterId,
        id: rasterId,
        maxzoom: 20,
        minzoom: 5,
      });

      // Zooom to the area
      map.fitBounds(bounds);
    });
  }, []);

  useEffect(() => {
    if (url && bounds) {
      const source = map.getSource(rasterId) as RasterTileSource;
      source.setTiles([url]);
      map.fitBounds(bounds);
    }
  }, [url, bounds]);

  return (
    <div
      className='flexible vertical center1 center2 center3'
      style={{ width: '100%', height: '100%' }}
    >
      <div id={mapDiv} style={{ display: loading ? 'none' : 'inline' }}></div>
      {loading ? <Loading image={image} /> : null}
    </div>
  );
}
