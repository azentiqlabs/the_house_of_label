import { NextResponse } from "next/server";
export function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}
export function parsePositiveInt(
  value: string | null,
  fallback: number,
  max = 100,
) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0
    ? Math.min(parsed, max)
    : fallback;
}
