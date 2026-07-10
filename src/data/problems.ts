/**
 * Farm-problem taxonomy and diagnosis types. The category list is static UI
 * config (kept intentionally); actual diagnosis results and the
 * common-problems library require the advisory backend (tasks.md, PRD §6.2).
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
