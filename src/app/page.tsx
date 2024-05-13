import App from '../components/main';
import inno from '../image/INNO4CFIs.png';

export default async function Home() {
  console.log(process.env.SERVICE_ACCOUNT_KEY_URL);

  return (
    <>
      <App image={inno} />
    </>
  );
}
