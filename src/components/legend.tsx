import visParam from '@/data/titiler-vis.json';
import { Context } from '@/module/store';
import { useContext } from 'react';

export default function Legend() {
  const { layer } = useContext(Context);

  if (!layer) {
    return;
  }

  const {
    bands,
    min,
    max,
    palette,
    type,
  }: {
    bands: string[];
    min: number;
    max: number;
    palette: string[];
    type: string;
  } = visParam[layer?.value];

  switch (type) {
    case 'composite': {
      const colors = ['red', 'green', 'blue'];
      return (
        <div className='flexible vertical gap'>
          <div className='title'>{layer?.label}</div>
          {bands.map((band, key) => (
            <div className='flexible small-gap center1' key={key}>
              <div
                style={{
                  width: '3vh',
                  height: '2vh',
                  backgroundColor: colors[key],
                  border: 'thin solid white',
                }}
              />
              {band}
            </div>
          ))}
        </div>
      );
    }
    case 'indices': {
      return (
        <div className='flexible vertical gap center1'>
          <div className='title'>{layer?.label}</div>
          <div className='flexible vertical small-gap center1'>
            {max}
            <div
              style={{
                height: '15vh',
                width: '4vh',
                border: 'thin solid white',
                backgroundImage: `linear-gradient(to top, ${palette.join(', ')})`,
              }}
            />
            {min}
          </div>
        </div>
      );
    }
  }
}
