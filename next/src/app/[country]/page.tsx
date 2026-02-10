import { Suspense } from 'react';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { awsCountries } from '@/lib/country';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Skeleton } from "@/components/ui/skeleton"
import { ModeToggle } from '@/components/mode-toggle.tsx';
import { SelectCountry } from '@/components/SelectCountry.tsx';
import { Button } from '@/components/ui/button.tsx';
import { GithubIcon } from '@/components/GithubIcon.tsx';

interface Video {
  url: string;
  len: string;
  thumbnail: string;
  title: string;
  channel: string;
  viewCount: string;
  publishedAt: string;
  ranking: string;
}

export default async function Index({ params }: { params: Promise<{ country: string }> }) {
  const country = (await params).country.toUpperCase();

  return (
    <div className='max-w-3xl min-h-svh mx-auto flex flex-col'>
      <header className='p-4'>
        <div className='flex justify-between'>
          <h1 className='text-2xl font-bold'><a href='/'>yt-ranking</a></h1>
          <div className='flex gap-2'>
            <SelectCountry country={country} />
            <ModeToggle />
            <Button variant='outline' size='icon' aria-label='github' asChild>
              <a href='https://github.com/stupidJoon/yt-ranking' target='_blank' rel='noopener noreferrer'><GithubIcon /></a>
            </Button>
          </div>
        </div>
        <p className='leading-none text-muted-foreground'>Youtube Trends • Hype Videos</p>
      </header>
      <Tabs defaultValue='popular'>
        <TabsList>
          <TabsTrigger value='popular'>Trends</TabsTrigger>
          <TabsTrigger value='hype'>Hype</TabsTrigger>
        </TabsList>
        <TabsContent value='popular'>
          <Suspense fallback={<Loading />}>
            <VideosTable chart='popular' country={country} />
          </Suspense>
        </TabsContent>
        <TabsContent value='hype'>
          <Suspense fallback={<Loading />}>
            <VideosTable chart='hype' country={country} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Loading() {
  return (
    <Table Container='main' className='table-fixed'>
      <TableBody>
        {[...Array(20)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className='rounded-lg h-[100px]' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

async function VideosTable({ chart, country }: { chart: string, country: string }) {
  let videos: Video[];
  if (chart === 'popular') videos = await getPopularVideos(country);
  else videos = await getHypeVideos(country);

  return (
    <Table Container='main' className='table-fixed'>
      <TableBody>
          {videos.map((video) => (
            <TableRow key={video.url}>
              <TableCell className='w-44 align-top relative'>
                <a href={video.url} target='_blank' rel='noopener noreferrer'>
                  <img className='rounded-lg h-[90px] object-cover' src={video.thumbnail} alt='thumbnail' width='160' height='90' />
                </a>
                <p className='absolute right-4 bottom-4 bg-background/70 px-1 rounded-sm'>{video.len}</p>
              </TableCell>
              <TableCell className='align-top space-y-1'>
                <h2 className='text-base/5 text-wrap line-clamp-2'>
                  <a href={video.url} target='_blank' rel='noopener noreferrer'>{video.title}</a>
                </h2>
                <p className='text-xs text-wrap line-clamp-1 text-muted-foreground'>{video.channel} • {video.viewCount} • {video.publishedAt}</p>
                <p className='text-xs bg-muted px-2 py-1 inline-block rounded-lg'>🌠 {video.ranking}</p>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

async function getPopularVideos(country: string): Promise<Video[]> {
  const toUrl = (str: string) => `https://www.youtube.com/watch?v=${str}`;
  const toLen = (str: string) => {
    const match = str.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (match === null) return '0:0';

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    const totalMinutes = hours * 60 + minutes;
    const paddedSeconds = seconds.toString().padStart(2, '0');
    return `${totalMinutes}:${paddedSeconds}`
  }
  const toViewcount = (str: string) => new Intl.NumberFormat('en', {
    notation: 'compact',
    compactDisplay: 'long',
    maximumFractionDigits: 1,
  }).format(Number(str)) + ' views';
  const toPublished = (str: string) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'always' });

    const now = new Date();
    const past = new Date(str);
    const diff = past.getTime() - now.getTime();

    const seconds = Math.round(diff / 1000);
    const minutes = Math.round(seconds / 60);
    const hours   = Math.round(minutes / 60);
    const days    = Math.round(hours / 24);

    if (Math.abs(days) >= 1) return rtf.format(days, 'day');
    if (Math.abs(hours) >= 1) return rtf.format(hours, 'hour');
    if (Math.abs(minutes) >= 1) return rtf.format(minutes, 'minute');
    return rtf.format(seconds, 'second');
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  const endpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=${country}&maxResults=50&key=${API_KEY}`;
  const res = await fetch(endpoint, {
    cache: 'no-store',
  });
  const { items } = await res.json();

  return items.map((item: any, i: number) => ({
    url: toUrl(item.id),
    len: toLen(item.contentDetails.duration),
    thumbnail: item.snippet.thumbnails.standard?.url ?? 'https://i.ytimg.com/',
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    viewCount: toViewcount(item.statistics.viewCount),
    publishedAt: toPublished(item.snippet.publishedAt),
    ranking: `#${i + 1} trends`,
  }));
}

async function getHypeVideos(country: string): Promise<Video[]> {
  const awsCountry = awsCountries.find((c) => c.code === country.toUpperCase());
  if (!awsCountry) return [];
  
  const client = new LambdaClient({
    region: awsCountry.region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const command = new InvokeCommand({
    FunctionName: awsCountry.arn,
    InvocationType: 'RequestResponse'
  });

  const response = await client.send(command);
  if (!response.Payload) return [];
  const result = JSON.parse(Buffer.from(response.Payload).toString());
  return result;
}
