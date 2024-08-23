import visParam from '@/data/titiler-vis.json';
import { Context } from '@/module/store';
import { useContext } from 'react';

export default function Legend() {
  const { layer } = useContext(Context);

  if (!layer) {
    return;
  }

  const {
    min,
    max,
    palette,
    unit,
  }: {
    min: number;
    max: number;
    palette: string[];
    unit: string;
  } = visParam[layer?.value];

  return (
    <div className='flexible vertical gap center1'>
      <div className='flexible vertical center1'>
        <div>{layer?.label}</div>
        <div>{`(${unit})`}</div>
      </div>
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
