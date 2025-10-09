import protobuf from 'protobufjs';

export default async function Home() {
  const videos = await getHypeVideos();

  return (
    <div>
      {JSON.stringify(videos)}
    </div>
  );
}

async function getHypeVideos() {
  const endpoint = 'https://youtubei.googleapis.com/youtubei/v1/browse';
  const config = 'CKXsl8cGEO2KrQUQ8rqtBRCOlq4FEIirrgUQvbauBRCO164FEJDXrgUQq5yvBRDagrAFELWKsAUQ56WwBRCc0LAFEM_SsAUQs_KwBRDj-LAFEJjZsQUQ15jOHBD8ss4cEObIzhwQwobPHBCrnc8cEOe9zxwQ-MbPHBCays8cENrTzxwQnNfPHBDL2s8cEM_gzxwQt-TPHBDP5c8cEKrozxwQr_PPHBDy9s8cEM_8zxwQ4f7PHBDo_s8cEOn-zxwQ-__PHBDMgNAcENWD0BwQmoXQHBD7h9AcEICI0BwQm4jQHBDziNAcEOyK0BwQxozQHBoyQU9qRm94MkRnWlhDLUtlNmQ4NDNhMjVxQmQyTjNGSWh5Y2g2YXBJX00tQV94OE93eWciMkFPakZveDF4V1dIWjJqaFlfUDcwbXU4N0NvOTVoVWg4b3lxU0RjZnlFdUphWTR5djVnKpACQ0FNU3hRRU5VNG5RcVFMdExObDRCdWdDN3diNEZPc0RfaXVqRGZJUXFnR2tGLXNBMXl1b0RrYlNGdDJ5bXhEa0JvMFAzQS1rQ3JVUzNBUHlDaGFrQTU0VTd4WVVud0hQRk9RR3d4TGxGWkVWcHcyVUFPSU1yaExfQmhWcXRxeldET0xIQTZTdjBnc1FuRDY3Rjh6ckJxUXNoc2NGbExNRzZXblQ0d2JHTWZ5VkJvRG9CTjFXbWdIb2FQNFY3Qk9VUi14ZW1ZRUduSDNNZmNrcl9tV0xIbUdmOVFhY1FPdGZ1QXV4TG9TWkJqTEtMNDBVNk13RzJhUUdBNnNKa0xrR0JkcHZ2RUhOZGVTT0JRPT0%3D';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-protobuf',
      'x-youtube-cold-config-data': config,
    },
    body: encode() as unknown as BodyInit,
  });
  const obj = decode(await res.arrayBuffer());
  console.log(obj);
  return obj;
}

function encode() {
  const payload = {
    f1: {
      f1: {
        f1: 'ko', // optional, 제목 자동번역 막고 한글로
        f16: 5,
        f17: '19.34.2',
      },
    },
    f2: 'FEhype_leaderboard',
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
  const buffer = Root.encode(payload).finish();
  return buffer;
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
