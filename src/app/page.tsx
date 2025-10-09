export default async function Home() {
  const res = await fetch('api/hype');
  const videos = await res.json()

  return (
    <div>
      {JSON.stringify(videos)}
    </div>
  );
}

