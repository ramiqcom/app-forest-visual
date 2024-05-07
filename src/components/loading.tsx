import Image from 'next/image';

/**
 * Showing loading component
 * Loading component
 */
export default function Loading({ image }) {
  return (
    <div id='loading' className='flexible vertical center1 center2 center3 big-gap'>
      <Image src={image} alt='INOO4CFIs logo' width={500} />
      ...Loading map
    </div>
  );
}
