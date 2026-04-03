import type { ScanCategory } from "@/lib/mockScan";
import { getRedis } from "@/lib/redisClient";

export type ThreadLiveEvent = {
  id: string;
  lat: number;
  lon: number;
  label: string;
  category: ScanCategory;
  at: number;
};

const MAX = 80;
const REDIS_KEY = "greenthread:thread-events";

declare global {
  var __gtThreadEvents: ThreadLiveEvent[] | undefined;
}

function memoryBucket(): ThreadLiveEvent[] {
  if (!globalThis.__gtThreadEvents) globalThis.__gtThreadEvents = [];
  return globalThis.__gtThreadEvents;
}

const citySeeds: [number, number][] = [
  [37.57, 126.98],
  [35.68, 139.76],
  [1.35, 103.82],
  [-23.55, -46.63],
  [40.71, -74.0],
  [51.51, -0.13],
  [-3.4, -62.2],
  [48.86, 2.35],
];

function jitter(lat: number, lon: number) {
  return {
    lat: lat + (Math.random() - 0.5) * 1.2,
    lon: lon + (Math.random() - 0.5) * 1.8,
  };
}

function coordsForCategory(category: ScanCategory) {
  const idx =
    category === "food"
      ? 0
      : category === "transport"
        ? 1 + Math.floor(Math.random() * 3)
        : 4 + Math.floor(Math.random() * 4);
  const [lat, lon] = citySeeds[idx % citySeeds.length]!;
  return jitter(lat, lon);
}

export async function appendScanThreadEvent(params: {
  label: string;
  category: ScanCategory;
}): Promise<ThreadLiveEvent> {
  const { lat, lon } = coordsForCategory(params.category);
  const ev: ThreadLiveEvent = {
    id: `live-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    lat,
    lon,
    label: params.label,
    category: params.category,
    at: Date.now(),
  };

  const redis = getRedis();
  if (redis) {
    const payload = JSON.stringify(ev);
    await redis.lpush(REDIS_KEY, payload);
    await redis.ltrim(REDIS_KEY, 0, MAX - 1);
    return ev;
  }

  const list = memoryBucket();
  list.unshift(ev);
  if (list.length > MAX) list.length = MAX;
  return ev;
}

export async function getThreadEvents(): Promise<ThreadLiveEvent[]> {
  const redis = getRedis();
  if (redis) {
    const raw = await redis.lrange(REDIS_KEY, 0, MAX - 1);
    const out: ThreadLiveEvent[] = [];
    for (const s of raw) {
      try {
        out.push(JSON.parse(s) as ThreadLiveEvent);
      } catch {
        /* skip */
      }
    }
    return out;
  }
  return [...memoryBucket()];
}
