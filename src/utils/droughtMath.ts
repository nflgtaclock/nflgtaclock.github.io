import { GtaEra, getSubsequentGtaReleases, resolveGtaEra } from '../data/gtaEras';
import { MilestoneKey, MilestoneRecord, NFL_TEAMS, NflTeam } from '../data/nflTeams';

export interface LiveDuration {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  years: number;
  months: number;
  remainingDays: number;
}

export interface TeamDroughtEntry {
  team: NflTeam;
  milestone: MilestoneKey;
  record: MilestoneRecord;
  isNever: boolean;
  /** Reference ISO date used for live ticking timer (either game date or Super Bowl era start for Never) */
  referenceDateIso: string;
  referenceTimestampMs: number;
  era: GtaEra;
  subsequentGtaReleases: GtaEra[];
  rank: number; // 1 = longest misery drought
  droughtMs: number;
}

export function getReferenceTimestamp(team: NflTeam, record: MilestoneRecord): {
  iso: string;
  ms: number;
} {
  const iso = record.date ?? team.sbEraStartDate;
  const timePart = record.kickoffUtc ?? '20:00:00Z';
  const parsed = Date.parse(`${iso}T${timePart}`);
  return {
    iso,
    ms: Number.isNaN(parsed) ? Date.parse(`${iso}T20:00:00Z`) : parsed,
  };
}

export function computeLiveDuration(referenceMs: number, nowMs: number): LiveDuration {
  const diff = Math.max(0, nowMs - referenceMs);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Calendar-aware years & months
  const start = new Date(referenceMs);
  const end = new Date(nowMs);
  let years = end.getUTCFullYear() - start.getUTCFullYear();
  let months = end.getUTCMonth() - start.getUTCMonth();
  let remainingDays = end.getUTCDate() - start.getUTCDate();

  if (remainingDays < 0) {
    months -= 1;
    const prevMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0));
    remainingDays += prevMonth.getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    totalMs: diff,
    days,
    hours,
    minutes,
    seconds,
    years: Math.max(0, years),
    months: Math.max(0, months),
    remainingDays: Math.max(0, remainingDays),
  };
}

export function formatShortDrought(duration: LiveDuration): string {
  if (duration.years > 0) {
    const yrLabel = duration.years === 1 ? 'yr' : 'yrs';
    const moLabel = duration.months === 1 ? 'mo' : 'mos';
    return `${duration.years} ${yrLabel}, ${duration.months} ${moLabel}`;
  }
  if (duration.months > 0) {
    const moLabel = duration.months === 1 ? 'mo' : 'mos';
    return `${duration.months} ${moLabel}, ${duration.remainingDays}d`;
  }
  return `${duration.days} days`;
}

export function formatLongDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatShortDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Builds the ranked 32-team leaderboard for a given milestone.
 * Teams with `Never` rank above teams with dated milestones, ordered by longest franchise wait.
 */
export function buildRankedEntries(
  milestone: MilestoneKey,
  nowMs: number
): TeamDroughtEntry[] {
  const raw = NFL_TEAMS.map((team) => {
    const record = team.milestones[milestone];
    const isNever = record.date === null;
    const { iso, ms } = getReferenceTimestamp(team, record);
    const era = resolveGtaEra(record.date);
    const subsequentGtaReleases = getSubsequentGtaReleases(era.id);
    return {
      team,
      milestone,
      record,
      isNever,
      referenceDateIso: iso,
      referenceTimestampMs: ms,
      era,
      subsequentGtaReleases,
      rank: 0,
      droughtMs: Math.max(0, nowMs - ms),
    };
  });

  // Sort: longest drought first; Never records come before dated records if tied or older
  raw.sort((a, b) => {
    if (a.isNever !== b.isNever) {
      return a.isNever ? -1 : 1;
    }
    if (b.droughtMs !== a.droughtMs) {
      return b.droughtMs - a.droughtMs;
    }
    return a.team.name.localeCompare(b.team.name);
  });

  return raw.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));
}
