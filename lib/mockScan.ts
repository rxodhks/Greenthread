export type ScanCategory = "food" | "transport" | "shopping";

export type ScanScenario = {
  id: string;
  category: ScanCategory;
  label: string;
  itemLabel: string;
  co2Kg: number;
  supplyChainNote: string;
  ngoName: string;
  ngoImpact: string;
  impactM2?: number;
  /** 데모 시나리오 묶음 버전(감사·재현용) */
  factorVersion: string;
  /** 계수·범주에 대한 교육용 출처 설명(법적 검증 대체 아님) */
  sourceNote: string;
};

const foodScenarios: ScanScenario[] = [
  {
    id: "beef",
    category: "food",
    label: "소고기 스테이크 세트",
    itemLabel: "육류 · 냉장 유통",
    co2Kg: 12.4,
    supplyChainNote:
      "사료·운송·냉장 공급망이 배출의 대부분을 차지합니다. 지역·계절 식재료로 대체 시 공급망 거리가 짧아집니다.",
    ngoName: "Rainforest Trust 파트너 보호구역",
    ngoImpact: "이 선택으로 아마존 열대우림 약 0.3m²가 보호되는 효과와 유사한 기여가 가능해요.",
    impactM2: 0.3,
    factorVersion: "greenthread-demo-2026.04",
    sourceNote:
      "육류 1식 기준 탄소강도 구간을 단순화한 데모 값입니다. 실제는 조리법·사육·유통에 따라 크게 달라집니다.",
  },
  {
    id: "avocado",
    category: "food",
    label: "아보카도 토스트",
    itemLabel: "과일 · 장거리 해상·육로",
    co2Kg: 0.9,
    supplyChainNote:
      "물 사용량과 수출국 농지 확장이 이슈입니다. 인증·공정무역 라벨이 공급망 투명도를 높입니다.",
    ngoName: "지속가능 농업 펀드",
    ngoImpact: "소액 기부로 열대 작물 지역의 재생 농업 교육 1시간분을 후원할 수 있어요.",
    factorVersion: "greenthread-demo-2026.04",
    sourceNote: "아보카도·토스트 1회 분량에 대한 순수 배출 추정(장거리 운송 가정 포함).",
  },
];

const transportScenarios: ScanScenario[] = [
  {
    id: "suv",
    category: "transport",
    label: "SUV 15km 통근",
    itemLabel: "개인 이동 · 연료",
    co2Kg: 4.2,
    supplyChainNote:
      "원유 정제·유통·차량 제조까지 포함하면 ‘탱크에서 바퀴까지’ 영향이 커집니다. 대중교통·전환 일수를 줄이면 즉시 감축됩니다.",
    ngoName: "도시 숲 조성 프로젝트",
    ngoImpact: "이번 이동을 상쇄하려면 도심 나무 1그루 1개월 흡수량과 비슷한 규모의 기여가 필요해요.",
    factorVersion: "greenthread-demo-2026.04",
    sourceNote: "SUV·15km·혼합 연비 가정의 단순 연료 연소 배출. 차량·연료별로 실제 값은 다릅니다.",
  },
  {
    id: "flight",
    category: "transport",
    label: "단거리 항공 (1구간)",
    itemLabel: "항공 · 연료·공항 인프라",
    co2Kg: 180,
    supplyChainNote:
      "고고도 배출과 비-CO₂ 효과까지 고려하면 단위 거리당 영향이 큽니다. 화상회의·철도 연계가 공급망(인프라) 부하를 줄입니다.",
    ngoName: "재생에너지 소규모 그리드",
    ngoImpact: "기부금의 일부가 오지 마을 태양광 유지비로 연결돼, 항공 배출 상쇄 프로젝트와 짝을 이룹니다.",
    factorVersion: "greenthread-demo-2026.04",
    sourceNote: "단거리 1구간·평균 탑승률 가정의 단순화된 데모 추정. Radiative forcing 미포함.",
  },
];

const shoppingScenarios: ScanScenario[] = [
  {
    id: "fastfashion",
    category: "shopping",
    label: "패스트패션 티셔츠 1벌",
    itemLabel: "섬유 · 염색·해상 운송",
    co2Kg: 5.5,
    supplyChainNote:
      "면·폴리 혼방은 재배·방직·염색·재고 폐기까지 긴 사슬을 가집니다. 수선·중고·소재 인증이 공급망 압력을 낮춥니다.",
    ngoName: "해양 미세플라스틱 정화",
    ngoImpact: "합성섬유 세탁과 연결된 해양 유입을 줄이는 NGO 활동에 연계할 수 있어요.",
    factorVersion: "greenthread-demo-2026.04",
    sourceNote: "면·폴리 혼방 티 1벌 생애주기를 단순화한 교육용 계수입니다.",
  },
  {
    id: "electronics",
    category: "shopping",
    label: "스마트폰 액세서리",
    itemLabel: "전자·희토류 공급망",
    co2Kg: 8.1,
    supplyChainNote:
      "채굴·제련·조립이 다국에 흩어져 있어 ‘실시간’ 추적이 중요합니다. 수리 가능 설계·EOL 회수가 순환도를 높입니다.",
    ngoName: "책임 채굴 이니셔티브",
    ngoImpact: "공정 채굴 커뮤니티 지원 프로젝트와 1:1 매칭해 투명한 기여 내역을 보여줄 수 있어요.",
    factorVersion: "greenthread-demo-2026.04",
    sourceNote: "저가 액세서리 1개 단위의 제조·운송을 통합한 데모 추정치입니다.",
  },
];

const allScenarios: ScanScenario[] = [
  ...foodScenarios,
  ...transportScenarios,
  ...shoppingScenarios,
];

const scenarioById: Record<string, ScanScenario> = Object.fromEntries(
  allScenarios.map((s) => [s.id, s]),
);

export const KNOWN_SCENARIO_IDS = allScenarios.map((s) => s.id);

export function getScenarioById(id: string): ScanScenario | undefined {
  return scenarioById[id];
}

/** 비전 힌트(영문 id 또는 라벨 키워드)를 시나리오로 매핑. 실패 시 카테고리 풀에서 랜덤. */
export function resolveScenarioFromHint(
  hint: string | null | undefined,
  category: ScanCategory,
): ScanScenario {
  const raw = (hint ?? "").trim().toLowerCase();
  if (raw && scenarioById[raw]) return scenarioById[raw]!;

  const pools: Record<ScanCategory, ScanScenario[]> = {
    food: foodScenarios,
    transport: transportScenarios,
    shopping: shoppingScenarios,
  };
  const pool = pools[category];

  const keywordPairs: [string, string][] = [
    ["beef", "beef"],
    ["steak", "beef"],
    ["소고기", "beef"],
    ["avocado", "avocado"],
    ["아보카도", "avocado"],
    ["suv", "suv"],
    ["car", "suv"],
    ["통근", "suv"],
    ["flight", "flight"],
    ["항공", "flight"],
    ["plane", "flight"],
    ["fashion", "fastfashion"],
    ["티셔츠", "fastfashion"],
    ["fastfashion", "fastfashion"],
    ["phone", "electronics"],
    ["전자", "electronics"],
    ["accessory", "electronics"],
  ];
  for (const [key, id] of keywordPairs) {
    if (raw.includes(key)) {
      const s = scenarioById[id];
      if (s && s.category === category) return s;
    }
  }

  const fuzzy = allScenarios.find(
    (s) => s.category === category && (raw.includes(s.id) || s.label.toLowerCase().includes(raw)),
  );
  if (fuzzy) return fuzzy;

  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function scenarioForCategory(category: ScanCategory): ScanScenario {
  const pools: Record<ScanCategory, ScanScenario[]> = {
    food: foodScenarios,
    transport: transportScenarios,
    shopping: shoppingScenarios,
  };
  const list = pools[category];
  return list[Math.floor(Math.random() * list.length)]!;
}

export type ThreadPoint = {
  id: string;
  lat: number;
  lon: number;
  label: string;
  intensity: number;
};

export const threadPoints: ThreadPoint[] = [
  { id: "1", lat: 37.57, lon: 126.98, label: "서울", intensity: 0.9 },
  { id: "2", lat: 35.68, lon: 139.76, label: "도쿄", intensity: 0.85 },
  { id: "3", lat: 1.35, lon: 103.82, label: "싱가포르", intensity: 0.7 },
  { id: "4", lat: -23.55, lon: -46.63, label: "상파울루", intensity: 0.75 },
  { id: "5", lat: 40.71, lon: -74.0, label: "뉴욕", intensity: 0.8 },
  { id: "6", lat: 51.51, lon: -0.13, label: "런던", intensity: 0.72 },
  { id: "7", lat: -3.4, lon: -62.2, label: "아마존 인근", intensity: 0.95 },
  { id: "8", lat: 48.86, lon: 2.35, label: "파리", intensity: 0.68 },
];
