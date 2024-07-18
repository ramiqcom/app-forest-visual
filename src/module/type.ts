import { Dispatch, SetStateAction } from 'react';

export type Option = { label: string; value: string | number };

export type Options = Option[];
export type SetState<T> = Dispatch<SetStateAction<T>>;

export type Status = {
  text: string;
  status: 'process' | 'failed' | 'success';
};

export type GlobalContext = {
  locations: Options;
  setLocations: SetState<Options>;
  location: Option;
  setLocation: SetState<Option>;
  periods: Options;
  setPeriods: SetState<Options>;
  period: Option;
  setPeriod: SetState<Option>;
  layers: Options;
  setLayers: SetState<Options>;
  layer: Option;
  setLayer: SetState<Option>;
  showPlot: boolean;
  setShowPlot: SetState<boolean>;
  showImage: boolean;
  setShowImage: SetState<boolean>;
  status: Status;
  setStatus: SetState<Status>;
};
