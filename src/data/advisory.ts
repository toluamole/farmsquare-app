export interface JourneyStage {
  id: string;
  name: string;
  phase: string;
  from: number;
  to: number;
  img: string;
  goal: string;
  details: string[];
  tip: string;
  inputs: string[];
}

export const FS_JOURNEY_CROP: JourneyStage[] = [
  {
    id: 'site', name: 'Site Selection', phase: 'Pre-Planting', from: -28, to: -21, img: 'site-selection',
    goal: 'Choose land that gives your crop the best start — before you spend a naira on inputs.',
    details: [
      'Pick well-drained loamy soil — avoid waterlogged valley bottoms in the rainy season.',
      'Check last season\'s history: land that carried tomato, pepper or potato last year can carry over bacterial wilt.',
      'Confirm water access — a stream, borehole or well within 200m makes dry-spell irrigation realistic.',
      'Test soil pH if you can (target 5.5–7.0 for most vegetables).',
      'Confirm road access for evacuating produce.',
    ],
    tip: 'Walk the land after a heavy rain before you commit — you\'ll see exactly where water stands.',
    inputs: [],
  },
  {
    id: 'fieldprep', name: 'Field Preparation', phase: 'Pre-Planting', from: -21, to: -7, img: 'field-preparation',
    goal: 'Clear, till and bed the land so roots establish fast and weeds start behind.',
    details: [
      'Clear vegetation and either compost or remove debris — avoid burning where you can; it kills soil life.',
      'Plough and harrow (or ridge by hand) to a fine tilth.',
      'Make ridges or beds: vegetables do best on beds 1m wide × 30cm high.',
      'Apply well-cured poultry manure or compost (2–4 t/acre) and work it in 1–2 weeks before planting.',
      'If weed pressure is heavy, apply a pre-emergence herbicide at least 2 weeks before planting.',
    ],
    tip: 'Prepare land early — rushing tillage into planting week is the #1 cause of poor germination beds.',
    inputs: ['p4'],
  },
  {
    id: 'seedproc', name: 'Procurement of Seed', phase: 'Pre-Planting', from: -14, to: -7, img: 'seed-procurement',
    goal: 'Buy certified seed from a traceable source — yield is decided the day you buy seed.',
    details: [
      'Buy only NASC-certified seed (look for the green certification tag) from registered dealers.',
      'Choose varieties proven in Nigeria: e.g. Cobra F1 / Platinum F1 tomato, SC419 / SAMMAZ maize.',
      'Hybrid (F1) seed costs more but yields 25–40% higher with better disease tolerance.',
      'Check the packing date and germination percentage on the sachet.',
      'Buy 10–15% extra seed for gap-filling after germination.',
    ],
    tip: 'Keep your seed receipt and sachet — certified dealers replace verified failed lots.',
    inputs: ['p1', 'p9', 'p8'],
  },
  {
    id: 'seedtreat', name: 'Seed Treatment', phase: 'Pre-Planting', from: -3, to: -1, img: 'seed-treatment',
    goal: 'Protect seed from soil pests and fungi during its most vulnerable two weeks.',
    details: [
      'Most certified seed already comes dressed (coloured coating) — do NOT re-treat dressed seed.',
      'For undressed seed, dress with a fungicide/insecticide seed treatment at the sachet rate.',
      'Wear gloves, treat in a basin away from food and children, and never eat treated seed.',
      'For vegetables raised in a nursery, soak trays/beds with a fungicide drench to prevent damping-off.',
      'Plant treated seed within a few days — don\'t store it long-term with food grain.',
    ],
    tip: 'Treated seed is always coloured (pink/green/blue) by law — that\'s how you know it\'s done.',
    inputs: ['p5'],
  },
  {
    id: 'sowing', name: 'Sowing & Planting', phase: 'Planting', from: 0, to: 0, img: 'sowing',
    goal: 'Get spacing, depth and timing right — the cheapest yield decision you\'ll ever make.',
    details: [
      'Plant at the start of steady rains, or to your irrigation schedule in dry season.',
      'Spacing guides: maize 75cm × 25cm; tomato transplants 60cm × 45cm; pepper 60cm × 50cm.',
      'Sow 2–4cm deep (rule of thumb: 2–3 times the seed\'s width). Deeper = slower, weaker emergence.',
      'For nursery crops (tomato, pepper), transplant 3–4 week seedlings in the evening and water immediately.',
      'Gap-fill within 7–10 days using your reserve seed so the stand stays even.',
    ],
    tip: 'Plant in the evening or on a cloudy day — transplants establish far better out of the midday sun.',
    inputs: [],
  },
  {
    id: 'irrigation', name: 'Irrigation & Water', phase: 'Growing', from: 0, to: 70, img: 'irrigation',
    goal: 'Keep moisture steady — stress at flowering can cost half the yield.',
    details: [
      'Vegetables need roughly 25–35mm of water per week (rain + irrigation combined).',
      'Drip irrigation cuts water use by ~60% versus flooding and keeps leaves dry (less disease).',
      'Water early morning or late evening to cut evaporation; never in the midday heat.',
      'Critical windows: germination (week 0–2) and flowering/fruit-set — never let the soil dry out then.',
      'Mulch beds with dry grass to hold moisture and suppress weeds at the same time.',
    ],
    tip: 'Push a finger 5cm into the soil — if it comes out dry, irrigate today.',
    inputs: ['p6', 'p10'],
  },
  {
    id: 'weeding', name: 'Weeding', phase: 'Growing', from: 14, to: 42, img: 'weeding',
    goal: 'Weeds steal up to 50% of yield in the first 6 weeks — win that window.',
    details: [
      'First weeding at 2–3 weeks after planting, second at 5–6 weeks.',
      'Hand-hoe between rows; pull within rows close to plants so you don\'t damage roots.',
      'For larger plots, selective post-emergence herbicides exist per crop.',
      'Remove weeds before they seed — one season of seeding means seven seasons of weeding.',
      'Pile pulled weeds away from beds or compost them.',
    ],
    tip: 'Weed after light rain — roots come out whole and the job is twice as fast.',
    inputs: ['p4', 'p7'],
  },
  {
    id: 'fertilizer', name: 'Fertilizer Application', phase: 'Growing', from: 14, to: 56, img: 'fertilizer',
    goal: 'Feed the crop in splits, at the right growth stage — not all at once.',
    details: [
      'Basal: NPK 15-15-15 at 2 weeks after planting/transplant — about 200–300kg/ha, placed 5–8cm beside the plant.',
      'Top-dress: Urea (46% N) at 5–6 weeks for leafy growth crops like maize.',
      'For fruiting vegetables, switch to a high-potassium feed at flowering for fruit size and firmness.',
      'Apply on moist soil and cover lightly; fertilizer on dry soil burns roots.',
      'Buy factory-sealed, NAFDAC-listed bags — adulterated fertilizer is common in open markets.',
    ],
    tip: 'Ring or band placement beats broadcasting — same bag, up to 30% more uptake.',
    inputs: ['p2', 'p3'],
  },
  {
    id: 'protection', name: 'Plant Protection', phase: 'Growing', from: 21, to: 70, img: 'plant-protection',
    goal: 'Scout weekly, spray only what you see — protect the crop and your own health.',
    details: [
      'Scout twice a week: check under leaves for eggs, whitefly, mites; check fruits for bore holes.',
      'Spray insecticide (e.g. Ampligo for caterpillars/armyworm) at first sighting — evening sprays catch night-feeding larvae.',
      'Alternate chemical classes between sprays so pests don\'t build resistance.',
      'Fungal pressure rises in the rains: preventive copper or mancozeb sprays every 7–14 days.',
      'Wear nose cover, gloves and long sleeves; observe the pre-harvest interval printed on every label.',
    ],
    tip: 'One ₦6,000 spray at first sighting beats three sprays after the outbreak.',
    inputs: ['p5', 'p7'],
  },
  {
    id: 'growth', name: 'Growth Monitoring', phase: 'Growing', from: 28, to: 65, img: 'crop-growth',
    goal: 'Walk the field weekly — the farmer\'s shadow is the best fertilizer.',
    details: [
      'Walk a W-pattern through the field weekly; sample 10 plants per leg and note height, colour and pest signs.',
      'Yellowing lower leaves = nitrogen hunger; purple tints = phosphorus; brown leaf edges = potassium.',
      'Stake or trellis tomato and climbing crops before they flop — fruits touching soil rot first.',
      'Prune tomato side-shoots (suckers) weekly for bigger, earlier fruit.',
      'Photograph anything strange and use the in-app problem diagnosis — early ID saves the season.',
    ],
    tip: 'Keep a simple notebook per plot — planting date, sprays, rains. Next season it becomes your playbook.',
    inputs: [],
  },
  {
    id: 'harvest', name: 'Harvesting', phase: 'Harvest', from: 65, to: 90, img: 'harvesting',
    goal: 'Harvest at the right maturity, in the cool of the day, into clean containers.',
    details: [
      'Harvest indicators: tomato at "breaker" stage (first blush of pink) for market transport.',
      'Pick in the early morning while produce is cool and firm — heat-picked produce wilts within hours.',
      'Use clean plastic crates, not raffia baskets or jute sacks, for soft produce.',
      'Harvest in rounds every 2–4 days for continuous crops like tomato, pepper, okra.',
      'Keep harvested produce in shade immediately — one hour in direct sun costs a day of shelf life.',
    ],
    tip: 'Negotiate with buyers BEFORE peak harvest — your price power vanishes when the lot is ripe.',
    inputs: [],
  },
  {
    id: 'postfield', name: 'Post-Field Management', phase: 'Post-Harvest', from: 90, to: 100, img: 'post-field',
    goal: 'Close the season properly — sanitation now is pest control for next season.',
    details: [
      'Uproot and remove crop residues — old tomato and pepper plants are a hotel for whitefly and blight spores.',
      'Compost healthy residues; burn or bury diseased plants away from the plot.',
      'Sort and grade produce: uniform Grade A lots earn 20–40% more from buyers than mixed bags.',
      'Plan rotation: follow heavy feeders (tomato, maize) with legumes (cowpea, soybean) to rebuild soil nitrogen.',
      'Plant a dry-season cover (or mulch the beds) so rains don\'t wash your topsoil away.',
    ],
    tip: 'Rotation is free disease control — never plant tomato after tomato on the same bed.',
    inputs: [],
  },
  {
    id: 'storage', name: 'Storage & Handling', phase: 'Post-Harvest', from: 100, to: 120, img: 'storage',
    goal: 'Stop the 40% post-harvest loss — store dry, cool, off the floor.',
    details: [
      'Dry grain to safe moisture before storage: maize ≤13%, rice paddy ≤14%. Bite test: a properly dry grain cracks, never dents.',
      'Use hermetic (airtight) bags — PICS bags kill weevils without chemicals and keep grain market-grade for 6+ months.',
      'Stack bags on pallets/planks, off walls, in a ventilated, rodent-proofed store.',
      'For fresh produce without cold rooms: evaporative charcoal coolers extend tomato shelf life from 3 days to ~2 weeks.',
      'Inspect stores every 2 weeks; one infested bag spreads in days.',
    ],
    tip: 'Prices typically peak 3–4 months after harvest glut — good storage IS the profit margin.',
    inputs: [],
  },
];

export const FS_CROP_TIMINGS: Record<string, { harvestFrom: number; harvestTo: number; label: string }> = {
  tomato:     { harvestFrom: 65,  harvestTo: 95,  label: 'Tomato' },
  maize:      { harvestFrom: 100, harvestTo: 115, label: 'Maize' },
  pepper:     { harvestFrom: 75,  harvestTo: 110, label: 'Pepper' },
  cucumber:   { harvestFrom: 45,  harvestTo: 65,  label: 'Cucumber' },
  rice:       { harvestFrom: 110, harvestTo: 130, label: 'Rice' },
  cassava:    { harvestFrom: 270, harvestTo: 365, label: 'Cassava' },
  yam:        { harvestFrom: 240, harvestTo: 300, label: 'Yam' },
  sesame:     { harvestFrom: 90,  harvestTo: 110, label: 'Sesame' },
  soybean:    { harvestFrom: 95,  harvestTo: 110, label: 'Soybean' },
  groundnut:  { harvestFrom: 90,  harvestTo: 120, label: 'Groundnut' },
  watermelon: { harvestFrom: 80,  harvestTo: 100, label: 'Watermelon' },
  onion:      { harvestFrom: 90,  harvestTo: 120, label: 'Onion' },
  cabbage:    { harvestFrom: 70,  harvestTo: 90,  label: 'Cabbage' },
};

export interface AdvisoryItem {
  id: string;
  kind: 'crop' | 'poultry';
  label: string;
  icon: string;
}

export function fsAdvisoryItems(profile: { crops?: string[]; types?: string[] }): AdvisoryItem[] {
  const items: AdvisoryItem[] = (profile.crops || []).map(c => {
    const t = FS_CROP_TIMINGS[c] || { label: c };
    const icons: Record<string, string> = {
      tomato: 'tomatoes', maize: 'maize', pepper: 'peppers', cucumber: 'market',
      cassava: 'rows', yam: 'rows', rice: 'field', sesame: 'seedling', soybean: 'seedling',
      groundnut: 'seedling', watermelon: 'market', onion: 'market', cabbage: 'market',
    };
    return { id: c, kind: 'crop' as const, label: t.label, icon: icons[c] || 'seedling' };
  });
  const types = profile.types || [];
  if (types.includes('Livestock Farmer') || types.includes('Mixed')) {
    items.push({ id: 'broiler', kind: 'poultry', label: 'Poultry (Broilers)', icon: 'chicks' });
  }
  return items;
}

export interface JourneyResult {
  stages: (JourneyStage & { status: 'done' | 'current' | 'upcoming'; fromDate: Date; toDate: Date })[];
  todayOffset: number;
  day0: Date;
}

export function fsJourneyFor(item: AdvisoryItem, dateISO: string): JourneyResult {
  const base = FS_JOURNEY_CROP;
  const t = FS_CROP_TIMINGS[item.id] || null;
  const day0 = new Date(dateISO + 'T12:00:00');
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const dayMs = 86400e3;
  const todayOffset = Math.round((today.getTime() - day0.getTime()) / dayMs);
  const stages = base.map(s => {
    let from = s.from, to = s.to;
    if (t && s.id === 'harvest') { from = t.harvestFrom; to = t.harvestTo; }
    if (t && s.id === 'postfield') { from = t.harvestTo; to = t.harvestTo + 10; }
    if (t && s.id === 'storage') { from = t.harvestTo + 10; to = t.harvestTo + 30; }
    if (t && (s.id === 'irrigation' || s.id === 'protection' || s.id === 'growth')) { to = Math.min(to, t.harvestFrom + 5); }
    const status = todayOffset > to ? 'done' : todayOffset >= from ? 'current' : 'upcoming';
    return {
      ...s, from, to, status: status as 'done' | 'current' | 'upcoming',
      fromDate: new Date(day0.getTime() + from * dayMs),
      toDate: new Date(day0.getTime() + to * dayMs),
    };
  });
  return { stages, todayOffset, day0 };
}
