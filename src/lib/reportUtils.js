import { base44 } from "@/api/base44Client";

export const REPORT_TIMEZONE = "Asia/Kolkata";

// Base44 returns created_date as a UTC ISO string WITHOUT a "Z" timezone
// designator (e.g. "2026-08-03T07:03:01.152000"). ECMAScript parses a no-Z
// datetime string as LOCAL time, so in a non-UTC browser the UTC instant is
// misread as local and then re-offset by formatISTTime — a double-offset error.
// Normalize such strings to UTC before constructing the Date.
function parseAsUTC(value) {
  if (!value) return new Date(NaN);
  const s = String(value).trim();
  // ISO 8601 datetime with no timezone designator -> treat as UTC
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(s)) return new Date(s + "Z");
  return new Date(s);
}

export function formatISTDate(utcString) {
  if (!utcString) return "--";
  const d = parseAsUTC(utcString);
  if (isNaN(d.getTime())) return "--";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: REPORT_TIMEZONE,
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return "--";
  }
}

export function formatISTTime(utcString) {
  if (!utcString) return "--";
  const d = parseAsUTC(utcString);
  if (isNaN(d.getTime())) return "--";
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: REPORT_TIMEZONE,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }).formatToParts(d);
    let hour = "", minute = "", ampm = "", tz = "";
    for (const p of parts) {
      if (p.type === "hour") hour = p.value;
      else if (p.type === "minute") minute = p.value;
      else if (p.type === "dayPeriod") ampm = p.value;
      else if (p.type === "timeZoneName") tz = p.value;
    }
    if (!hour || !minute) return "--";
    if (!tz || tz.startsWith("GMT")) tz = "IST";
    return `${hour}:${minute} ${ampm} ${tz}`.trim();
  } catch {
    return "--";
  }
}

function randomHex(length) {
  const bytes = new Uint8Array(Math.ceil(length / 2));
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, length)
    .toUpperCase();
}

export function generateReportId(date = new Date()) {
  const d = new Date(date);
  let y, m, day;
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: REPORT_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(d);
    for (const p of parts) {
      if (p.type === "year") y = p.value;
      else if (p.type === "month") m = p.value;
      else if (p.type === "day") day = p.value;
    }
  } catch {
    y = String(d.getUTCFullYear());
    m = String(d.getUTCMonth() + 1).padStart(2, "0");
    day = String(d.getUTCDate()).padStart(2, "0");
  }
  return `NS-${y}${m}${day}-${randomHex(8)}`;
}

export async function fetchScanByIdentifier(identifier) {
  if (!identifier) return null;
  try {
    const byReportId = await base44.entities.SkinScan.filter(
      { report_id: identifier },
      "-created_date",
      1
    );
    if (byReportId && byReportId.length > 0) return byReportId[0];
  } catch {
    /* fall through to internal id lookup */
  }
  try {
    return await base44.entities.SkinScan.get(identifier);
  } catch {
    return null;
  }
}