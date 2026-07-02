/**
 * Crop-advisory data layer. There is no advisory backend yet, so the journey
 * functions return empty results and the screens show empty states. The screen
 * UI is preserved so it lights up once these return real stages.
 */

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

export interface JourneyResult {
  stages: StageWithStatus[];
  todayOffset: number;
  day0: Date;
}

const DAY_MS = 86400000;

export function cropLabel(cropId: string): string {
  if (cropId === 'poultry' || cropId === 'broiler') return 'Poultry (Broilers)';
  return cropId.charAt(0).toUpperCase() + cropId.slice(1);
}

export async function getCropJourney(_cropId: string, dateISO: string): Promise<JourneyResult> {
  // TODO: fetch the crop growing guide from backend. None yet → empty journey.
  const day0 = new Date(dateISO + 'T12:00:00');
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const todayOffset = Math.floor((today.getTime() - day0.getTime()) / DAY_MS);
  return { stages: [], todayOffset, day0 };
}

export async function getCropStage(
  cropId: string,
  stageId: string,
  dateISO: string,
): Promise<StageWithStatus | undefined> {
  // TODO: fetch a single stage guide from backend. None yet → undefined.
  const { stages } = await getCropJourney(cropId, dateISO);
  return stages.find(s => s.id === stageId);
}
