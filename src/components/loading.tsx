import Image from 'next/image';
import inno from '../image/INNO4CFIs.png';

/**
 * Showing loading component
 * Loading component
 */
export default function Loading() {
  return (
    <div id='loading' className='flexible vertical center1 center2 center3'>
      <Image src={inno} alt='INOO4CFIs logo' width={500} />
    </div>
  );
}
