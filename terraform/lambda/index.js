import protobuf from 'protobufjs';

export const handler = (event) => {
  return getHypeVideos();
}

async function getHypeVideos() {
  const endpoint = 'https://youtubei.googleapis.com/youtubei/v1/browse';
  const res = await fetch(endpoint, {
    cache: 'no-store',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-protobuf',
    },
    body: await encode(),
  });
  const arrayBuffer = await res.arrayBuffer();
  const decoded = await decode(arrayBuffer);
  return formatResponse(decoded);
}

async function encode() {
  const payload = {
    f1: {
      f1: {
        // f1: 'ko', // optional, 제목 자동번역 막고 한글로
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
  const root = await protobuf.load('request.proto');
  const Root = root.lookupType('request.Root');
  const u8 = Root.encode(payload).finish();
  return Buffer.from(u8);
}

async function decode(buffer) {
  const root = await protobuf.load('response.proto');
  const Root = root.lookupType('response.Root');
  const u8 = new Uint8Array(buffer);
  const message = Root.decode(u8);
  const object = Root.toObject(message, {
    longs: String,
    enums: String,
    bytes: String, // base64
    defaults: false,
    arrays: true,
    objects: true,
    oneofs: true,
  });

  // Decode visitor_data (base64) if present
  // try {
  //   // const visitorDataB64 = object?.context?.visitor_data_b64;
  //   const visitorDataB64 = object.f1.f6[0].kvPairs[3].value;
  //   if (visitorDataB64) {
  //     const VisitorData = root.lookupType('response.VisitorData');
  //     const vdBuf = Buffer.from(visitorDataB64, 'base64');
  //     const vdMsg = VisitorData.decode(vdBuf);
  //     object.visitor_data_decoded = VisitorData.toObject(vdMsg, {
  //       longs: String,
  //       enums: String,
  //       bytes: String,
  //       defaults: false,
  //       arrays: true,
  //       objects: true,
  //       oneofs: true,
  //     });
  //   }
  // } catch (err) {
  //   object.visitor_data_decoded = { error: String(err) };
  // }
  // console.log(object.visitor_data_decoded);

  return object;
}

function formatResponse(data) {
  const arr = data.f9.f58173949[0].f1[0].f58174010[0].f4.f49399797[0].f1;
  return arr.map((item) => {
    const f1 = item.f50195462[0].f1.f153515154[0].f172660663.f1.f168777401.f5.f232971250.f25.f1;
    const f2 = item.f50195462[0].f1.f153515154[0].f172660663.f1.f168777401.f5.f232971250.f25.f2;
    const data = f2.split(' - ').toReversed();
    return {
      url: f1.f6,
      len: f1.f1.f2,
      thumbnail: f1.f1.f1.f1.at(-1).url,
      title: f1.f2.f1,
      channel: f1.f2.f2,
      viewCount: data[3],
      publishedAt: data[2],
      ranking: data[1],
    }
  });
}
