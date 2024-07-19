'use server';

export async function loadStadiaKey() {
  return process.env.NEXT_PUBLIC_STADIA_KEY;
}

export async function loadPrivateKey() {
  const key = await fetch(process.env.SERVICE_ACCOUNT_KEY_URL, {
    headers: {
      Authorization: `token ${process.env.GH_TOKEN}`,
    },
  });
  const json = await key.json();
  return json;
}
