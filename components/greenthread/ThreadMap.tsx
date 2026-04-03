"use client";

import { useEffect, useState } from "react";
import { threadPoints } from "@/lib/mockScan";
import type { ThreadLiveEvent } from "@/lib/threadEventStore";

const links = [
  { from: "1", to: "7" },
  { from: "2", to: "5" },
  { from: "4", to: "6" },
  { from: "3", to: "8" },
  { from: "5", to: "7" },
];

type ThreadEventsPayload = { events: ThreadLiveEvent[] };

type MapGeo = {
  landPathD: string;
  project: (lat: number, lon: number) => { x: number; y: number };
};

export function ThreadMap() {
  const [live, setLive] = useState<ThreadLiveEvent[]>([]);
  const [geo, setGeo] = useState<MapGeo | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("@/lib/threadMapGeo").then((m) => {
      if (!cancelled) setGeo(m.getThreadMapGeo());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/thread-events", { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as ThreadEventsPayload;
        if (!cancelled) setLive(data.events ?? []);
      } catch {
        /* ignore */
      }
    }

    void load();
    const t = window.setInterval(() => void load(), 4000);
    const onScan = () => void load();
    window.addEventListener("gt-scan-complete", onScan);
    return () => {
      cancelled = true;
      window.clearInterval(t);
      window.removeEventListener("gt-scan-complete", onScan);
    };
  }, []);

  return (
    <section id="thread" className="scroll-mt-20 border-b border-emerald-900/10 bg-emerald-950 px-4 py-16 text-emerald-50 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-semibold text-white">글로벌 Green Thread</h2>
        <p className="mt-2 max-w-2xl text-emerald-100/75">
          각 사용자의 스캔·기부·챌린지가 노드로 쌓이고, 실시간으로 곡선이 이어집니다. 육지 윤곽은 Natural Earth 110m 데이터를
          등장방위 투영으로 그립니다(지도 데이터는 탭 로드 후 지연 로딩). 최근 스캔은 폴링으로 반영하며, Upstash Redis를 쓰면 여러
          인스턴스 간에도 이벤트가 공유됩니다.
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-900/40 shadow-xl shadow-black/30">
          <svg viewBox="0 0 1000 500" className="h-auto w-full" role="img" aria-label="세계 지도 위 스레드 시각화">
            <defs>
              <linearGradient id="gt-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#6ee7b7" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.1" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="1000" height="500" fill="#022c22" />

            {geo?.landPathD ? (
              <path
                d={geo.landPathD}
                fill="#065f46"
                fillOpacity={0.48}
                stroke="#34d399"
                strokeOpacity={0.22}
                strokeWidth={0.55}
              />
            ) : null}

            {geo
              ? links.map((l, i) => {
                  const a = threadPoints.find((p) => p.id === l.from)!;
                  const b = threadPoints.find((p) => p.id === l.to)!;
                  const pa = geo.project(a.lat, a.lon);
                  const pb = geo.project(b.lat, b.lon);
                  const x1 = pa.x;
                  const y1 = pa.y;
                  const x2 = pb.x;
                  const y2 = pb.y;
                  const mx = (x1 + x2) / 2;
                  const my = Math.min(y1, y2) - 80 - i * 12;
                  const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
                  return (
                    <path
                      key={`${l.from}-${l.to}`}
                      d={d}
                      fill="none"
                      stroke="url(#gt-line)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="6 10"
                      className="gt-thread-line"
                      style={{ strokeDashoffset: i * 24 }}
                    />
                  );
                })
              : null}

            {geo
              ? threadPoints.map((p) => {
                  const { x: cx, y: cy } = geo.project(p.lat, p.lon);
                  const r = 4 + p.intensity * 5;
                  return (
                    <g key={p.id} filter="url(#glow)">
                      <circle cx={cx} cy={cy} r={r + 6} fill="#34d399" opacity="0.15" className="animate-pulse" />
                      <circle cx={cx} cy={cy} r={r} fill="#6ee7b7" opacity="0.95" />
                      <text x={cx + 10} y={cy - 8} fill="#d1fae5" fontSize="11" className="font-sans">
                        {p.label}
                      </text>
                    </g>
                  );
                })
              : null}

            {geo
              ? live.map((ev) => {
                  const { x: cx, y: cy } = geo.project(ev.lat, ev.lon);
                  return (
                    <g key={ev.id} filter="url(#glow)">
                      <circle cx={cx} cy={cy} r={14} fill="#fbbf24" opacity="0.2" className="animate-pulse" />
                      <circle cx={cx} cy={cy} r={5} fill="#fcd34d" opacity="0.95" />
                      <text x={cx + 10} y={cy - 8} fill="#fef3c7" fontSize="10" className="font-sans">
                        {ev.label}
                      </text>
                    </g>
                  );
                })
              : null}
          </svg>
        </div>
      </div>
    </section>
  );
}
