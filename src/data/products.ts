export interface Product {
  id: string;
  cat: string;
  name: string;
  price: number;
  was?: number;
  img?: string | null;
  imgLabel: string;
  rating: number;
  reviews: number;
  stock: 'in' | 'low' | 'out';
  sku: string;
  deal?: string;
  desc: string;
  specs: [string, string][];
  related?: string[];
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export const FS_CATEGORIES: Category[] = [
  { id: 'seeds', label: 'Seeds', icon: 'seed' },
  { id: 'fertilizers', label: 'Fertilizers', icon: 'drop' },
  { id: 'agrochemicals', label: 'Agrochemicals', icon: 'spray' },
  { id: 'irrigation', label: 'Irrigation', icon: 'sun' },
  { id: 'equipment', label: 'Equipment', icon: 'tool' },
  { id: 'livestock', label: 'Livestock', icon: 'cow' },
];

export const FS_PRODUCTS: Product[] = [
  {
    id: 'p1', cat: 'seeds', name: 'Cobra F1 Hybrid Tomato Seeds — 10g', price: 4500, was: 5200, img: null,
    imgLabel: 'tomato seeds sachet', rating: 4.7, reviews: 214, stock: 'in', sku: 'FS-SD-0114',
    desc: 'High-yielding determinate hybrid tomato with excellent firmness and shelf life. Tolerant to bacterial wilt and TYLCV. Suited to open field and greenhouse production across Nigeria.',
    specs: [['Variety', 'Cobra F1 (determinate)'], ['Net weight', '10g (~3,000 seeds)'], ['Maturity', '65–70 days after transplant'], ['Yield potential', '25–35 t/ha'], ['Certification', 'NASC certified']],
    related: ['p7', 'p4', 'p2'],
  },
  {
    id: 'p2', cat: 'fertilizers', name: 'NPK 15-15-15 Fertilizer — 50kg bag', price: 28000, img: null,
    imgLabel: 'NPK 50kg bag', rating: 4.8, reviews: 530, stock: 'in', sku: 'FS-FT-2201', deal: 'd1',
    desc: 'Balanced granular NPK for vegetative growth across maize, tomato, pepper and rice. Factory-sealed, NAFDAC-certified bags.',
    specs: [['Analysis', 'N15 : P15 : K15'], ['Weight', '50kg'], ['Form', 'Granular'], ['Application', 'Basal & top dressing']],
    related: ['p3', 'p8', 'p1'],
  },
  {
    id: 'p3', cat: 'fertilizers', name: 'Urea 46% — 50kg bag', price: 24500, was: 26000, img: null,
    imgLabel: 'Urea 50kg bag', rating: 4.6, reviews: 318, stock: 'in', sku: 'FS-FT-2210',
    desc: 'High-nitrogen urea for rapid vegetative growth and top dressing of cereals.',
    specs: [['Analysis', 'N 46%'], ['Weight', '50kg']],
    related: ['p2', 'p8'],
  },
  {
    id: 'p4', cat: 'agrochemicals', name: 'Force Up Glyphosate Herbicide — 1L', price: 3800, img: null,
    imgLabel: 'herbicide 1L bottle', rating: 4.5, reviews: 190, stock: 'in', sku: 'FS-AG-3140',
    desc: 'Non-selective systemic herbicide for pre-planting weed control. Apply with knapsack sprayer in dry weather.',
    specs: [['Active', 'Glyphosate 360 g/L'], ['Volume', '1 Litre'], ['Rate', '4–6 L/ha']],
    related: ['p7', 'p5'],
  },
  {
    id: 'p5', cat: 'agrochemicals', name: 'Ampligo Insecticide — 100ml', price: 6200, img: null,
    imgLabel: 'insecticide 100ml', rating: 4.8, reviews: 142, stock: 'low', sku: 'FS-AG-3155',
    desc: 'Broad-spectrum insecticide for tomato fruit worm, armyworm and whitefly control.',
    specs: [['Active', 'Chlorantraniliprole + Lambda-cyhalothrin'], ['Volume', '100ml']],
    related: ['p4', 'p1'],
  },
  {
    id: 'p6', cat: 'irrigation', name: 'Drip Irrigation Kit — ¼ acre', price: 65000, was: 74000, img: null,
    imgLabel: 'drip irrigation kit', rating: 4.6, reviews: 87, stock: 'in', sku: 'FS-IR-4012',
    desc: 'Complete gravity-fed drip kit: 16mm laterals, emitters at 30cm spacing, filters and fittings for a ¼-acre vegetable plot.',
    specs: [['Coverage', '¼ acre (~1,000 m²)'], ['Lines', '16mm × 20 rolls'], ['Emitter spacing', '30cm']],
    related: ['p10', 'p1'],
  },
  {
    id: 'p7', cat: 'equipment', name: 'CP3 Knapsack Sprayer — 16L', price: 18000, was: 21500, img: null,
    imgLabel: 'knapsack sprayer 16L', rating: 4.4, reviews: 265, stock: 'in', sku: 'FS-EQ-5021',
    desc: 'Durable 16-litre knapsack sprayer with brass nozzle set and viton seals. Suited to herbicide and foliar application.',
    specs: [['Capacity', '16 Litres'], ['Pressure', '2–4 bar'], ['Warranty', '12 months']],
    related: ['p4', 'p5'],
  },
  {
    id: 'p8', cat: 'seeds', name: 'SC419 Hybrid Maize Seed — 2kg', price: 7800, img: null,
    imgLabel: 'hybrid maize seed', rating: 4.7, reviews: 402, stock: 'in', sku: 'FS-SD-0150',
    desc: 'Drought-tolerant early-maturing hybrid maize. Excellent for both wet and dry season planting with irrigation.',
    specs: [['Variety', 'SC419'], ['Weight', '2kg'], ['Maturity', '105–110 days']],
    related: ['p2', 'p3'],
  },
  {
    id: 'p9', cat: 'seeds', name: 'California Wonder Pepper Seeds — 10g', price: 3200, img: null,
    imgLabel: 'pepper seeds', rating: 4.5, reviews: 96, stock: 'in', sku: 'FS-SD-0162',
    desc: 'Sweet bell pepper variety with thick walls and high market demand.',
    specs: [['Weight', '10g'], ['Maturity', '75 days']],
    related: ['p1', 'p5'],
  },
  {
    id: 'p10', cat: 'irrigation', name: 'Solar Water Pump — 1HP', price: 185000, img: null,
    imgLabel: 'solar water pump', rating: 4.9, reviews: 41, stock: 'low', sku: 'FS-IR-4055',
    desc: 'Solar-powered surface pump for irrigation from streams, wells and tanks. Includes 2 panels and controller.',
    specs: [['Power', '1HP'], ['Head', '35m max'], ['Flow', '3.5 m³/h']],
    related: ['p6'],
  },
  {
    id: 'p11', cat: 'livestock', name: 'Broiler Starter Feed — 25kg', price: 16500, img: null,
    imgLabel: 'broiler feed 25kg', rating: 4.6, reviews: 174, stock: 'in', sku: 'FS-LV-6033',
    desc: 'Complete starter ration for broilers 0–4 weeks, 22% crude protein.',
    specs: [['Weight', '25kg'], ['Protein', '22%']],
    related: ['p12'],
  },
  {
    id: 'p12', cat: 'livestock', name: 'Day-Old Broiler Chicks — box of 50', price: 42500, img: null,
    imgLabel: 'day-old chicks box', rating: 4.7, reviews: 88, stock: 'in', sku: 'FS-LV-6010',
    desc: 'Vaccinated day-old broiler chicks from certified hatcheries. Pre-order, dispatched Tuesdays.',
    specs: [['Quantity', '50 chicks'], ['Vaccination', "Marek + ND"]],
    related: ['p11'],
  },
];

export function fsProduct(id: string): Product | undefined {
  return FS_PRODUCTS.find(p => p.id === id);
}

export const FS_CROPS: [string, string][] = [
  ['tomato', 'Tomato'], ['maize', 'Maize'], ['pepper', 'Pepper'], ['sesame', 'Sesame'],
  ['cucumber', 'Cucumber'], ['cassava', 'Cassava'], ['yam', 'Yam'], ['rice', 'Rice'],
  ['soybean', 'Soybean'], ['groundnut', 'Groundnut'], ['watermelon', 'Watermelon'],
  ['onion', 'Onion'], ['cabbage', 'Cabbage'],
];

export const FS_CROP_ICONS: Record<string, string> = {
  tomato: 'tomatoes', maize: 'maize', pepper: 'peppers', cucumber: 'market',
  cassava: 'rows', yam: 'rows', rice: 'field', sesame: 'seedling', soybean: 'seedling',
  groundnut: 'seedling', watermelon: 'market', onion: 'market', cabbage: 'market',
};

export const FS_STAGES = ['Pre-Planting', 'Planting', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity', 'Post-Harvest'];

export interface CalendarActivity {
  wk: number;
  stage: string;
  title: string;
  status: 'done' | 'today' | 'pending';
  time: string;
  steps: string[];
  inputs: string[];
  tip: string;
  due?: string;
}

export const FS_CALENDAR: CalendarActivity[] = [
  {
    wk: -2, stage: 'Pre-Planting', title: 'Clear and prepare land', status: 'done', time: '1–2 days per acre',
    steps: ['Clear vegetation and burn or compost debris', 'Apply pre-emergence herbicide if weed pressure is high', 'Make beds 1m wide, 30cm high with good drainage'],
    inputs: ['p4', 'p7'], tip: 'Spray glyphosate at least 14 days before transplanting.',
  },
  {
    wk: -1, stage: 'Pre-Planting', title: 'Raise nursery seedlings', status: 'done', time: '2–3 hours',
    steps: ['Sow Cobra F1 seeds in trays or nursery beds', 'Water lightly every morning', 'Shade with palm fronds or net for the first week'],
    inputs: ['p1'], tip: 'Use sterile potting media to prevent damping-off.',
  },
  {
    wk: 1, stage: 'Planting', title: 'Transplant seedlings', status: 'done', time: '3–4 hours per ¼ acre',
    steps: ['Transplant 4-week-old seedlings in the evening', 'Space 60cm between rows, 45cm within rows', 'Water immediately after transplanting'],
    inputs: [], tip: 'Transplant after 4pm to reduce shock.',
  },
  {
    wk: 2, stage: 'Vegetative', title: 'First fertilizer application', status: 'done', time: '2 hours per ¼ acre',
    steps: ['Apply NPK 15-15-15 in a ring 8cm from each stem', 'Use one matchbox-full (10g) per plant', 'Water in after application'],
    inputs: ['p2'], tip: 'Do not let granules touch the stem — they burn.',
  },
  {
    wk: 3, stage: 'Vegetative', title: 'First weeding', status: 'done', time: '2–4 hours per acre',
    steps: ['Hoe shallowly between rows', 'Hand-pull weeds close to the plants', 'Mulch with dry grass to suppress regrowth'],
    inputs: [], tip: 'Shallow weeding only — tomato roots are near the surface.',
  },
  {
    wk: 4, stage: 'Flowering', title: 'Stake your tomato plants', status: 'today', time: '2–3 hours per ¼ acre',
    steps: ['Drive 1.5m stakes 10cm from each plant', 'Tie the main stem loosely with soft twine', 'Remove suckers below the first flower cluster'],
    inputs: ['p7'], tip: 'Stake before fruit set — staking later damages roots and breaks stems.',
  },
  {
    wk: 4, stage: 'Flowering', title: 'Spray against fruit worm', status: 'pending', due: 'Thu, Jun 12', time: '1 hour per ¼ acre',
    steps: ['Scout for bored flowers and frass', 'Mix Ampligo at 10ml per 15L knapsack', 'Spray in the early evening, covering flower clusters'],
    inputs: ['p5', 'p7'], tip: 'Do not spray if rain is expected within 6 hours.',
  },
  {
    wk: 5, stage: 'Fruiting', title: 'Top-dress with NPK', status: 'pending', due: 'Mon, Jun 16', time: '2 hours per ¼ acre',
    steps: ['Apply second NPK dose at fruit set', 'Water deeply after application'],
    inputs: ['p2'], tip: 'Stop nitrogen-heavy feeding once fruits start to colour.',
  },
  {
    wk: 7, stage: 'Maturity', title: 'Begin harvest at breaker stage', status: 'pending', due: 'Week of Jun 30', time: 'Every 3–4 days',
    steps: ['Pick fruits showing first pink blush', 'Harvest in the morning into clean crates', 'Grade by size before market'],
    inputs: [], tip: 'Breaker-stage fruits survive transport to market far better than ripe ones.',
  },
];

export const FS_PROBLEM_CATS = [
  ['pest', 'Pest', 'alert'], ['disease', 'Disease', 'leaf'], ['nutrient', 'Nutrient Deficiency', 'drop'],
  ['soil', 'Soil Issue', 'rows'], ['weather', 'Weather Damage', 'sun'], ['postharvest', 'Post-Harvest', 'box'],
  ["unsure", "I'm Not Sure", 'search'],
];

export interface Diagnosis {
  id: string;
  title: string;
  confidence: number;
  cause: string;
  symptoms: string[];
  treatment: string[];
  prevention: string;
  products: string[];
  cost: [number, number];
}

export const FS_DIAGNOSES: Diagnosis[] = [
  {
    id: 'dx1', title: 'Tomato Yellow Leaf Curl Virus (TYLCV)', confidence: 87,
    cause: 'A viral disease spread by whiteflies. Leaves yellow at the edges, curl upward and inward, and plants become stunted. Spreads fastest in dry, warm weather.',
    symptoms: ['Upward-curling, cupped leaves', 'Yellowing leaf edges starting from younger leaves', 'Stunted bushy growth, flower drop'],
    treatment: ['Remove and burn badly infected plants immediately', 'Control whiteflies — spray Ampligo at 10ml/15L every 7 days', 'Spray undersides of leaves where whiteflies rest', 'Keep the field weed-free; weeds host whiteflies'],
    prevention: 'Plant TYLCV-tolerant varieties like Cobra F1 and use yellow sticky traps from week 1.',
    products: ['p5', 'p7', 'p1'], cost: [6200, 24200],
  },
  {
    id: 'dx2', title: 'Magnesium Deficiency', confidence: 64,
    cause: 'Yellowing between leaf veins on older leaves while veins stay green. Common in sandy soils after heavy rain.',
    symptoms: ['Interveinal yellowing on older/lower leaves', 'Veins remain green', 'Leaves may curl slightly at edges'],
    treatment: ['Apply magnesium sulphate (Epsom salt) foliar spray at 20g/L', 'Repeat after 10–14 days', 'Side-dress with balanced NPK'],
    prevention: 'Use balanced fertilizer programmes; avoid over-applying potassium.',
    products: ['p2'], cost: [3500, 12000],
  },
  {
    id: 'dx3', title: 'Early Blight (Alternaria)', confidence: 41,
    cause: 'Fungal disease causing yellow patches that develop dark concentric rings, starting on lower leaves in humid conditions.',
    symptoms: ['Yellow patches turning brown with target-like rings', 'Starts on oldest, lowest leaves', 'Leaf drop moving up the plant'],
    treatment: ['Remove affected lower leaves', 'Spray a mancozeb-based fungicide every 7 days', 'Avoid overhead watering late in the day'],
    prevention: 'Stake plants and prune for airflow; rotate away from tomato family for 2 seasons.',
    products: ['p7'], cost: [4000, 9500],
  },
];

export const FS_LIBRARY = [
  { icon: 'alert', title: 'Whiteflies on tomato', sub: 'Tiny white insects under leaves', crops: 'Tomato · Pepper' },
  { icon: 'leaf', title: 'Maize streak virus', sub: 'Yellow streaks along maize leaves', crops: 'Maize' },
  { icon: 'drop', title: 'Nitrogen deficiency', sub: 'Pale yellow older leaves, slow growth', crops: 'All crops' },
  { icon: 'alert', title: 'Fall armyworm', sub: 'Ragged holes in whorl leaves', crops: 'Maize · Rice' },
  { icon: 'rows', title: 'Waterlogged beds', sub: 'Wilting despite wet soil', crops: 'Tomato · Pepper' },
];

export const FS_STATES = ['Lagos', 'Ogun', 'Oyo', 'Kano', 'Kaduna', 'Katsina', 'Rivers', 'Enugu', 'Plateau', 'Benue', 'Niger', 'FCT Abuja'];
export const FS_LGAS: Record<string, string[]> = {
  Lagos: ['Ikeja', 'Alimosho', 'Epe', 'Ikorodu', 'Badagry', 'Eti-Osa'],
  Kano: ['Nassarawa', 'Fagge', 'Dala', 'Gwale'],
  Ogun: ['Abeokuta South', 'Ijebu Ode', 'Sagamu'],
};

export const FS_NOTIFS = [
  { icon: 'zap', tone: 'amber', title: 'NPK deal is 70% full', body: 'Only 180 bags left in the truck-load deal. Reserve before it closes.', time: '2h ago', unread: true, group: 'Today' },
  { icon: 'leaf', tone: 'green', title: "Today's farm task", body: 'Stake your tomato plants — Week 4, Flowering stage.', time: '6h ago', unread: true, group: 'Today' },
  { icon: 'cart', tone: 'green', title: 'Order #FS-20431 delivered', body: 'Your CP3 Knapsack Sprayer was delivered to Ikeja.', time: 'Yesterday', unread: false, group: 'Yesterday' },
  { icon: 'wallet', tone: 'blue', title: 'Flash deal: seeds −15%', body: 'All hybrid vegetable seeds discounted until Friday.', time: 'Yesterday', unread: false, group: 'Yesterday' },
];
