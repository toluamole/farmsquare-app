/**
 * Farm-problem diagnosis data layer. The problem-type taxonomy below is static
 * UI config. Actual diagnosis and the common-problems library require a backend
 * (model/API) that does not exist yet, so `diagnose()` and `getCommonProblems()`
 * return empty and the UI shows empty states. Wire these up later.
 */

export interface ProblemCategory {
  id: string;
  label: string;
  icon: string; // Ionicons name
}

// Fixed taxonomy of problem types (UI config, not fabricated content).
export const PROBLEM_CATEGORIES: ProblemCategory[] = [
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

export interface DiagnoseInput {
  crop: string;
  category: string;
  description: string;
}

export async function diagnose(_input: DiagnoseInput): Promise<Diagnosis[]> {
  // TODO: call the diagnosis backend (model/API). Not implemented yet → empty.
  return [];
}

export interface CommonProblem {
  icon: string; // Ionicons name
  title: string;
  sub: string;
  crops: string;
}

export async function getCommonProblems(): Promise<CommonProblem[]> {
  // TODO: fetch the common-problems library from backend. None yet → empty.
  return [];
}
