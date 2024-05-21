import { Map } from 'maplibre-gl';
import { Dispatch, SetStateAction } from 'react';

export type Option = { label: string; value: string | number };

export type Options = Option[];
export type SetState<T> = Dispatch<SetStateAction<T>>;

export type VisObject = {
  bands?: string[];
  min: number[];
  max: number[];
  palette?: string[];
  name?: string;
  unit?: string;
};

export type GlobalContext = {
  locations: Options;
  location: Option;
  setLocation: SetState<Option>;
  periods: Options;
  setPeriods: SetState<Options>;
  period: Option;
  setPeriod: SetState<Option>;
  layers: Options;
  layer: Option;
  setLayer: SetState<Option>;
  url: string;
  setUrl: SetState<string>;
  vis: VisObject;
  setVis: SetState<VisObject>;
  showPlot: boolean;
  setShowPlot: SetState<boolean>;
  showImage: boolean;
  setShowImage: SetState<boolean>;
  map: Map;
  setMap: SetState<Map>;
};

export type LayerBody = {
  location: string;
  period: string;
  layer: string;
};

export type LayerOutput = {
  url?: string;
  message?: string;
  ok?: boolean;
  vis?: VisObject;
};

export type MapId = {
  mapid: string;
  urlFormat: string;
  image: Record<string, any>;
};
