import ee from '@google/earthengine';
import { bbox } from '@turf/turf';
import { LngLatBoundsLike } from 'maplibre-gl';
import collections from '../data/collection.json';
import layers from '../data/layer.json';
import { authenticate, evaluate, getMapId } from './ee';
import { LayerBody, LayerOutput, VisObject } from './type';

/**
 * Function to load earth engine layer
 * @param body
 * @returns
 */
export async function loadLayer(body: LayerBody): Promise<LayerOutput> {
  const key = process.env.SERVICE_ACCOUNT_KEY;
  await authenticate(key);

  const { location, period, layer } = body;

  const { collection, bands } = layers.filter((dict) => dict.value == layer)[0];

  let image: ee.Image = ee
    .ImageCollection(collections[collection])
    .filter(ee.Filter.and(ee.Filter.eq('location', location), ee.Filter.date(period)))
    .first();

  const mask: ee.Image = image.reduce(ee.Reducer.anyNonZero());

  image = image.updateMask(mask);

  const vis = await stretch(image, bands);

  const { urlFormat } = await getMapId(image, vis);

  const bounds = bbox(await evaluate(image.geometry())) as LngLatBoundsLike;
  return { url: urlFormat, vis, bounds };
}

/**
 * Function to get visualization stretch for visualize image
 * @param image
 * @param bands
 * @param palette
 * @returns
 */
async function stretch(image: ee.Image, bands: string[], palette?: string[]): Promise<VisObject> {
  const geometry: ee.Geometry = image.geometry();
  const percentile: ee.Dictionary = image.select(bands).reduceRegion({
    scale: 10,
    geometry,
    maxPixels: 1e13,
    reducer: ee.Reducer.percentile([1, 99]),
  });

  const min: ee.List<ee.Number> = ee.List(
    bands.map((band) => ee.Number(percentile.get(`${band}_p1`))),
  );
  const max: ee.List<ee.Number> = ee.List(
    bands.map((band) => ee.Number(percentile.get(`${band}_p99`))),
  );

  const vis: ee.Dictionary<VisObject> = ee.Dictionary({
    min,
    max,
    bands,
    palette: palette || null,
  });

  const evaluatedVis: VisObject = await evaluate(vis);

  return evaluatedVis;
}
