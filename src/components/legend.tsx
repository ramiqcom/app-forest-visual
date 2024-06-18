import { useContext } from 'react';
import { Context } from '../module/store';

export default function Legend() {
  const { vis, layer } = useContext(Context);

  if (vis) {
    const { bands, min, max, palette, unit, name, values, labels } = vis;

    if (layer.value != 'lc' && vis.bands) {
      if (bands.length > 1) {
        const rgb = ['red', 'green', 'blue'];
        const legend = bands.map((band, index) => (
          <div key={index} className='flexible gap'>
            <div
              style={{
                backgroundColor: rgb[index],
                width: '2vh',
                height: '2vh',
                border: 'thin solid white',
              }}
            ></div>
            {band}
          </div>
        ));
        return (
          <div className='flexible vertical big-gap center1'>
            <div>{name}</div>
            <div className='flexible vertical big-gap'>{legend}</div>
          </div>
        );
      } else {
        const colorList = palette.join(', ');
        const linear = `linear-gradient(to top, ${colorList})`;
        const gradient = (
          <div
            style={{ background: linear, height: '15vh', width: '5vh', border: 'thin solid white' }}
          ></div>
        );
        return (
          <div className='flexible vertical big-gap center1'>
            <div className='flexible vertical center1'>
              <div>{name}</div>
              {unit ? <div>({unit})</div> : null}
            </div>
            <div>{max[0].toFixed(2)}</div>
            {gradient}
            <div>{min[0].toFixed(2)}</div>
          </div>
        );
      }
    } else {
      if (palette && labels) {
        const lcLegend = [];
        for (let i = 0; i < palette.length; i++) {
          lcLegend.push(
            <div className='flexible small-gap center1' key={i}>
              <div style={{ backgroundColor: `#${palette[i]}`, width: '3vh', height: '2vh' }} />
              <div>{labels[i]}</div>
            </div>,
          );
        }
        return (
          <div className='flexible vertical small-gap'>
            <div className='flexible vertical center1'>{name}</div>
            {lcLegend}
          </div>
        );
      }
    }
  }
}
