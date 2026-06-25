// Problem-solver data ported from the design prototype (project/app/fs-data.jsx):
// FS_PROBLEM_CATS, FS_DIAGNOSES and the common-problems library.

export interface ProblemCategory {
  id: string;
  label: string;
  icon: string; // Ionicons name
}

export const FS_PROBLEM_CATS: ProblemCategory[] = [
  { id: 'pest', label: 'Pest', icon: 'bug-outline' },
  { id: 'disease', label: 'Disease', icon: 'leaf-outline' },
  { id: 'nutrient', label: 'Nutrient Deficiency', icon: 'water-outline' },
  { id: 'soil', label: 'Soil Issue', icon: 'layers-outline' },
  { id: 'weather', label: 'Weather Damage', icon: 'partly-sunny-outline' },
  { id: 'postharvest', label: 'Post-Harvest', icon: 'Package' },
  { id: 'unsure', label: "I'm Not Sure", icon: 'help-circle-outline' },
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

export interface CommonProblem {
  icon: string; // Ionicons name
  title: string;
  sub: string;
  crops: string;
}

export const FS_COMMON_PROBLEMS: CommonProblem[] = [
  { icon: 'bug-outline', title: 'Whiteflies on tomato', sub: 'Tiny white insects under leaves', crops: 'Tomato · Pepper' },
  { icon: 'leaf-outline', title: 'Maize streak virus', sub: 'Yellow streaks along maize leaves', crops: 'Maize' },
  { icon: 'water-outline', title: 'Nitrogen deficiency', sub: 'Pale yellow older leaves, slow growth', crops: 'All crops' },
  { icon: 'bug-outline', title: 'Fall armyworm', sub: 'Ragged holes in whorl leaves', crops: 'Maize · Rice' },
  { icon: 'layers-outline', title: 'Waterlogged beds', sub: 'Wilting despite wet soil', crops: 'Tomato · Pepper' },
];
