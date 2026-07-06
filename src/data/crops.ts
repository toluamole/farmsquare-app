/**
 * Crop display helpers and growing-guide types. Stage content itself comes
 * from the advisory backend / 5-crop agronomist guides (tasks.md, PRD §6.1) —
 * nothing is fabricated here.
 */

export function cropLabel(cropId: string): string {
  if (cropId === 'poultry' || cropId === 'broiler') return 'Poultry (Broilers)';
  return cropId.charAt(0).toUpperCase() + cropId.slice(1);
}

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

export type StageStatus = 'done' | 'current' | 'upcoming';

export interface StageWithStatus extends JourneyStage {
  status: StageStatus;
  fromDate: Date;
  toDate: Date;
}
