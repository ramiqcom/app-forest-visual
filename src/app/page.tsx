import App from '@/components/main';
import eu from '@/image/EN_Co-fundedbytheEU_RGB_WHITE-300x67.png';
import inno from '@/image/INNO4CFIs.png';
import s4g from '@/image/s4glogowhite.png';

export default async function Home() {
  return (
    <>
      <App images={{ s4g, eu, inno }} />
    </>
  );
}
