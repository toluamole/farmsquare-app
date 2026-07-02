import { Deal } from '../data/deals';

/**
 * Group Buy data layer. There is no Group Buy backend yet, so `getDeals()`
 * returns empty (screens show empty states) and `reserveDeal()` is unimplemented.
 * Wire these to the real endpoints later.
 */
export type { Deal };

export async function getDeals(): Promise<Deal[]> {
  // TODO: fetch active/upcoming/closed deals from backend. None yet → empty.
  return [];
}

export interface ReserveInput {
  dealId: string;
  qty: number;
  total: number;
}

export async function reserveDeal(_input: ReserveInput): Promise<{ ref: string }> {
  // TODO: create a reservation via backend (escrow hold, etc.).
  throw new Error('Group Buy reservation backend not implemented');
}
