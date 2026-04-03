import { geoEquirectangular, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import * as topojson from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import landTopology from "world-atlas/land-110m.json";

export const THREAD_MAP_WIDTH = 1000;
export const THREAD_MAP_HEIGHT = 500;

type LandTopology = Topology<{ land: GeometryCollection }>;

let cached:
  | {
      landPathD: string;
      project: (lat: number, lon: number) => { x: number; y: number };
    }
  | undefined;

/** Natural Earth 110m 육지 + 등장방위 투영. ThreadMap SVG 좌표계와 동일. */
export function getThreadMapGeo() {
  if (cached) return cached;

  const topology = landTopology as unknown as LandTopology;
  const land = topojson.feature(topology, topology.objects.land) as
    | Feature<Geometry, GeoJsonProperties>
    | FeatureCollection<Geometry, GeoJsonProperties>;

  const projection = geoEquirectangular().fitSize([THREAD_MAP_WIDTH, THREAD_MAP_HEIGHT], land);

  const pathGen = geoPath(projection);
  const landPathD = pathGen(land) ?? "";

  const project = (lat: number, lon: number) => {
    const p = projection([lon, lat]);
    if (!p || Number.isNaN(p[0]) || Number.isNaN(p[1])) return { x: 0, y: 0 };
    return { x: p[0]!, y: p[1]! };
  };

  cached = { landPathD, project };
  return cached;
}
