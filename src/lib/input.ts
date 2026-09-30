/** A value as it might arrive from a form field: a number, text, or nothing. */
export type RawNumber = number | string | null | undefined;

/**
 * Reads a raw value as a positive, finite number, or returns null when it is
 * blank, not a number, zero or negative.
 */
export function parsePositiveNumber(raw: RawNumber): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "string" && raw.trim() === "") return null;
  const value = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
}
