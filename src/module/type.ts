import { Dispatch, SetStateAction } from 'react';

export type Option = { label: string; value: string | number };
export type Options = Option[];

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type ImageData = {
  region: Option;
  years: Options;
  layers: Options;
  bounds: number[];
};
export type Collection = ImageData[];

export type Status = {
  text: string;
  status: 'process' | 'failed' | 'success';
};

export type GlobalContext = {
  collection: Collection;
  regions: Options;
  setRegions: SetState<Options>;
  region: Option;
  setRegion: SetState<Option>;
  years: Options;
  setYears: SetState<Options>;
  year: Option;
  setYear: SetState<Option>;
  layers: Options;
  setLayers: SetState<Options>;
  layer: Option;
  setLayer: SetState<Option>;
  showImage: boolean;
  setShowImage: SetState<boolean>;
  status: Status;
  setStatus: SetState<Status>;
};
