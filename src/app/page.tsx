import protobuf from 'protobufjs';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table.tsx';
import { ModeToggle } from '@/components/mode-toggle.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';

interface Video {
  url: string;
  len: string;
  thumbnail: string;
  title: string;
  creator: string;
  hits: string;
  created: string;
  ranking: string;
}

export default async function Home() {
  return (
    <div className='max-w-3xl min-h-svh mx-auto flex flex-col'>
      <header className='p-4 flex justify-between align-middle'>
        <div>
          <h1 className='text-2xl font-bold'>yt-ranking</h1>
          <p className='text-muted-foreground'>유튜브 Trends • Hype 동영상 랭킹</p>
        </div>
        <ModeToggle />
      </header>
      <Tabs defaultValue='popular'>
        <TabsList>
          <TabsTrigger value='popular'>Trends</TabsTrigger>
          <TabsTrigger value='hype'>Hype</TabsTrigger>
        </TabsList>
        <TabsContent value='popular'>
          <VideosTable chart='popular' />
        </TabsContent>
        <TabsContent value='hype'>
          <VideosTable chart='hype' />
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function VideosTable({ chart }: { chart: string }) {
  let videos: Video[];
  if (chart === 'popular') videos = await getPopularVideos();
  else videos = await getHypeVideos();

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
                <p className='text-xs text-wrap line-clamp-1 text-muted-foreground'>{video.creator} • {video.hits} • {video.created}</p>
                <p className='text-xs bg-muted px-2 py-1 inline-block rounded-lg'>🌠 {video.ranking}</p>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

async function getPopularVideos(): Promise<Video[]> {
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
  const toViewcount = (str: string) => `조회수 ${Math.floor(Number(str) / 10000)}만회`;
  const toCreated = (str: string) => {
    const inputDate = new Date(str);
    const now = new Date();
    const diffMs = now.getTime() - inputDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays >= 1) {
      return `${diffDays}일 전`;
    } else {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      return `${diffHours}시간 전`;
    }
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  const endpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=KR&maxResults=50&key=${API_KEY}`;
  const res = await fetch(endpoint, {
    cache: 'no-store',
  });
  const { items } = await res.json();

  return items.map((item: any, i: number) => ({
    url: toUrl(item.id),
    len: toLen(item.contentDetails.duration),
    // thumbnail: item.snippet.thumbnails.maxres.url,
    thumbnail: item.snippet.thumbnails.standard.url,
    title: item.snippet.title,
    creator: item.snippet.channelTitle,
    hits: toViewcount(item.statistics.viewCount),
    created: toCreated(item.snippet.publishedAt),
    ranking: `Trends 순위 ${i + 1}위`,
  }));
}

async function getHypeVideos(): Promise<Video[]> {
  const endpoint = 'https://youtubei.googleapis.com/youtubei/v1/browse';
  const config = process.env.YOUTUBE_COLD_CONFIG ?? '';
  const res = await fetch(endpoint, {
    cache: 'no-store',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-protobuf',
      'x-youtube-cold-config-data': config,
    },
    body: encode(),
  });
  const object = decode(await res.arrayBuffer());

  return object.field_9.f_58173949.f_1[0].f_58174010.f_4.f_49399797.f_1.map((obj: any) => {
    const f_1 = obj.f_50195462.f_1.f_153515154.f_172660663.f_1.f_168777401.f_5.f_232971250.f_25.f_1;
    const f_2 = obj.f_50195462.f_1.f_153515154.f_172660663.f_1.f_168777401.f_5.f_232971250.f_25.f_2;
    const data = f_2.split(' - ').toReversed()
    return {
      url: f_1.f_6,
      len: f_1.f_1.f_2,
      thumbnail: f_1.f_1.f_1.f_1.at(-1).f_1,
      title: f_1.f_2.f_1,
      creator: f_1.f_2.f_2,
      hits: data[3],
      created: data[2],
      ranking: data[1],
    }
  });
}

function encode() {
  const payload = {
    f1: {
      f1: {
        f1: 'ko', // optional, 제목 자동번역 막고 한글로
        f16: 5,
        f17: '19.34.2',
        f37: 428,
        f38: 926,
        f65: 0x40400000,
      },
    },
    f2: 'FEhype_leaderboard',
    // f2: 'FEtrending',
  };
  const proto = `
syntax = "proto3";
package demo;

message Root {
  Msg1 f1 = 1;
  string f2 = 2;
  Msg26 f26 = 26;
  int32 f29 = 29;
  Msg33 f33 = 33;
}

message Msg1 {
  Device f1 = 1;   // 디바이스/환경 블록
  string f3 = 3;   // ""
  M5 f5 = 5;       // 정책/세팅 추정
  M6 f6 = 6;       // 시그니처/토큰 추정
}

message Device {
  string f1 = 1;   // "ko"
  string f2 = 2;   // "KR"
  string f12 = 12; // "Apple"
  string f13 = 13; // "iPhone14,3"
  int32  f16 = 16;
  string f17 = 17; // "19.34.2"
  string f18 = 18; // "iOS"
  string f19 = 19; // "26.0.1.23A355"
  int32  f37 = 37;
  int32  f38 = 38;
  int32  f41 = 41;
  int32  f46 = 46;
  int32  f55 = 55;
  int32  f56 = 56;
  int32  f61 = 61;
  fixed32 f65 = 65; // 0x40400000
  int32  f67 = 67;
  int32  f78 = 78;
  string f80 = 80;  // "Asia/Seoul"
  M84   f84 = 84;   // 해시/아이디 배열 추정
  uint32 f95 = 95;
  M97   f97 = 97;
  M99   f99 = 99;
  M100  f100 = 100;
  uint32 f105 = 105;
}

message M84 { repeated uint64 f4 = 4; }
message M97 { uint32 f1 = 1; uint32 f2 = 2; }
message M99 { string f1 = 1; }

message M100 { M100A f1 = 1; }
message M100A { uint32 f1 = 1; uint32 f3 = 3; }

message M5 { M5_33 f33 = 33; }
message M5_33 { M5_33_2 f2 = 2; }
message M5_33_2 {
  uint32 f1 = 1;
  M5_33_2_2 f2 = 2;
  uint32 f3 = 3;
  uint64 f5 = 5;
}
message M5_33_2_2 { M5_33_2_2_7 f7 = 7; }
message M5_33_2_2_7 { repeated Pair f1 = 1; }
message Pair { uint32 f1 = 1; uint32 f2 = 2; }

message M6 { M6_2 f2 = 2; }
message M6_2 {
  uint32 f1 = 1;
  uint32 f2 = 2;
  uint32 f3 = 3;
  M6_2_4 f4 = 4;
  bytes f25 = 25;
}
message M6_2_4 {
  uint64  f1 = 1;
  fixed32 f2 = 2;
  fixed32 f3 = 3;
}

message Msg26 { uint32 f2 = 2; uint32 f5 = 5; }
message Msg33 { Msg33_2 f2 = 2; }
message Msg33_2 { uint32 f1 = 1; }
  `;
  const root = protobuf.parse(proto).root;
  const Root = root.lookupType('demo.Root');
  const u8 = Root.encode(payload).finish();
  return Buffer.from(u8);
}

function decode(buffer: ArrayBuffer) {
  const proto = `
syntax = "proto3";

package example;

// 루트 메시지
message RootMessage {
  InnerMessage field_1 = 1;
  Container9   field_9 = 9;
}

// 내부 메시지 (1번 필드)
message InnerMessage {
  repeated SubMessage field_6 = 6;
}

// 하위 메시지 (각 6 블록)
message SubMessage {
  int32 id = 1;  // 예: 2, 4, 6
  repeated Entry entries = 2;
}

// 키-값 쌍 구조
message Entry {
  string key = 1;
  string value = 2;
}

message Container9 {
  Msg58173949 f_58173949 = 58173949;
}

message Msg58173949 {
  repeated Msg9_1 f_1 = 1;
}

message Msg9_1 {
  Msg58174010 f_58174010 = 58174010;
}

message Msg58174010 {
  string title = 2;
  int32 ordinal = 3;
  Msg0_4 f_4 = 4;
}

message Msg0_4 {
  Msg49399797 f_49399797 = 49399797;
}

message Msg49399797 {
  repeated Msg7_1 f_1 = 1;
}

message Msg7_1 {
  Msg50195462 f_50195462 = 50195462;
}

message Msg50195462 {
  Msg2_1 f_1 = 1;
}

message Msg2_1 {
  Msg153515154 f_153515154 = 153515154;
}

message Msg153515154 {
  bytes f3 = 3;
  bytes f5 = 5;
  Msg172660663 f_172660663 = 172660663;
}

message Msg172660663 {
  Msg3_1 f_1 = 1;
}

message Msg3_1 {
  Msg168777401 f_168777401 = 168777401;
}

message Msg168777401 {
  Msg1_5 f_5 = 5;
}

message Msg1_5 {
  Msg232971250 f_232971250 = 232971250;
}

message Msg232971250 {
  Msg25 f_25 = 25;
}

message Msg25 {
  Msg5_1 f_1 = 1;
  string f_2 = 2;
  Msg5_3 f_3 = 3;
}

message Msg5_3 {
  Msg169495254 f_169495254 = 169495254;
}

message Msg169495254 {
  Msg462702848 f_462702848 = 462702848;
}

message Msg462702848 {
  Msg8_1 f_1 = 1;
}

message Msg8_1 {
  Msg48687757 f_48687757 = 48687757;
}

message Msg48687757 {
  Msg128119224 f_128119224 = 128119224;
}

message Msg128119224 {
  Msg128400768 f_128400768 = 128400768;
}

message Msg128400768 {
  Msg4_8_1 f_1 = 1;
}

message Msg4_8_1 {
  Msg1_7 f_7 = 7;
}

message Msg1_7 {
  Msg51779735 f_51779735 = 51779735;
}

message Msg51779735 {
  Msg7_5_1 f_1 = 1;
}

message Msg7_5_1 {
  Msg1_49399797 f_49399797 = 49399797;
}

message Msg1_49399797 {
  Msg1_7_1 f_1 = 1;
}

message Msg1_7_1 {
  Msg216561405 f_216561405 = 216561405;
}

message Msg216561405 {
  Msg1_5_1 f_1 = 1;
}

message Msg1_5_1 {
  Msg218178449 f_218178449 = 218178449;
}

message Msg218178449 {
  Msg9_2 f_2 = 2;
}

message Msg9_2 {
 Msg9_2_1 f_1 = 1;
}

message Msg9_2_1 {
  string f_1 = 1;
}





message Msg5_1 {
  Msg1_1 f_1 = 1;
  Msg1_2 f_2 = 2;
  string f_6 = 6;
}

message Msg1_1 {
  Msg1_1_1 f_1 = 1;
  string f_2 = 2;
}

message Msg1_1_1 {
  repeated Msg1_1_1_1 f_1 = 1;
}

message Msg1_1_1_1 {
  string f_1 = 1;
}

message Msg1_2 {
  string f_1 = 1;
  string f_2 = 2;
  Msg2_6 f_6 = 6;
}

message Msg2_6 {
  string f_1 = 1;
}

// 172 -> 1 -> 168777401 -> 5 -> 232971250 -> 25 -> 3 -> 169495254 -> 74168064 -> 4
  `;
  const root = protobuf.parse(proto).root;
  const Envelope = root.lookupType('example.RootMessage');
  const u8 = new Uint8Array(buffer);
  const message = Envelope.decode(u8);
  const object = Envelope.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
  });
  return object;
}
