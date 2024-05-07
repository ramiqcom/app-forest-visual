import { LngLatBoundsLike } from 'maplibre-gl';
import { Dispatch, SetStateAction } from 'react';

export type Option = { label: string; value: string | number };

export type Options = Option[];

export type setString = Dispatch<SetStateAction<string>>;
export type setNumber = Dispatch<SetStateAction<number>>;
export type SetOption = Dispatch<SetStateAction<Option>>;
export type SetOptions = Dispatch<SetStateAction<Options>>;
export type setBoolean = Dispatch<SetStateAction<boolean>>;
export type setVisObject = Dispatch<SetStateAction<VisObject>>;
export type setBounds = Dispatch<SetStateAction<LngLatBoundsLike>>;

export type VisObject = {
  bands?: string[] | string;
  min: number[] | number;
  max: number[] | number;
  palette?: string[] | string;
};

export type GlobalContext = {
  locations: Options;
  location: Option;
  setLocation: SetOption;
  periods: Options;
  setPeriods: SetOptions;
  period: Option;
  setPeriod: SetOption;
  layers: Options;
  layer: Option;
  setLayer: SetOption;
  url: string;
  setUrl: setString;
  vis: VisObject;
  setVis: setVisObject;
  bounds: LngLatBoundsLike;
  setBounds: setBounds;
  loading: boolean;
  setLoading: setBoolean;
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
  bounds?: LngLatBoundsLike;
};

export type MapId = {
  mapid: string;
  urlFormat: string;
  image: Record<string, any>;
};
