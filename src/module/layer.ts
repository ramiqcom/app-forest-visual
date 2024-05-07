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

  // Layer
  const filterLayer = layers.filter((dict) => dict.value == layer);

  // Check layer
  if (!filterLayer.length) {
    throw new Error(`Layer ${layer} is not available`);
  }

  // Layer data
  const { collection, bands, type, formula, palette } = filterLayer[0];

  // Collection id
  const colId = collections[collection];

  // Check collection id
  if (!colId) {
    throw new Error(`Collection ${colId} is not available`);
  }

  // Filter and get image
  let image: ee.Image = ee
    .ImageCollection(colId)
    .filter(ee.Filter.and(ee.Filter.eq('location', location), ee.Filter.eq('period', period)))
    .first();

  if (collection == 'pleaiades') {
    image = image.divide(10000);
    const mask: ee.Image = image.reduce(ee.Reducer.anyNonZero());
    image = image.updateMask(mask);
  }

  if (type == 'indices' && collection == 'pleaiades') {
    image = image.expression(formula, {
      NIR: image.select('b4'),
      RED: image.select('b1'),
      GREEN: image.select('b2'),
      BLUE: image.select('b3'),
    });
  }

  const vis = await stretch(image, bands, type == 'indices' ? palette : null);

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
