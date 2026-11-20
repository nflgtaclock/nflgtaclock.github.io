import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, RotateCcw, Search, X } from 'lucide-react';
import { GTA_ERA_MAP } from '../data/gtaEras';
import { MILESTONE_OPTIONS, MilestoneKey } from '../data/nflTeams';
import {
  TeamDroughtEntry,
  computeLiveDuration,
  formatShortDate,
  formatShortDrought,
  pad2,
} from '../utils/droughtMath';
import { ConferenceFilter, EraFilter } from './EraFilterStrip';

export type SortField = 'rank' | 'team' | 'date' | 'era' | 'drought';
export type SortDirection = 'asc' | 'desc';

interface DroughtLeaderboardProps {
  entries: TeamDroughtEntry[];
  allEntriesMaxDroughtMs: number;
  nowMs: number;
  activeMilestone: MilestoneKey;
  selectedTeamAbbr: string;
  onSelectTeam: (abbr: string) => void;
  activeEra: EraFilter;
  activeConference: ConferenceFilter;
  onResetFilters: () => void;
}

export const DroughtLeaderboard: React.FC<DroughtLeaderboardProps> = ({
  entries,
  allEntriesMaxDroughtMs,
  nowMs,
  activeMilestone,
  selectedTeamAbbr,
  onSelectTeam,
  activeEra,
  activeConference,
  onResetFilters,
}) => {
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const milestoneMeta =
    MILESTONE_OPTIONS.find((m) => m.key === activeMilestone) ?? MILESTONE_OPTIONS[0];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'drought' ? 'desc' : 'asc');
    }
  };

  const displayedEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = q
      ? entries.filter(
          (e) =>
            e.team.name.toLowerCase().includes(q) ||
            e.team.abbr.toLowerCase().includes(q) ||
            e.team.division.toLowerCase().includes(q) ||
            e.era.eraBadge.toLowerCase().includes(q) ||
            (e.record.opponentName?.toLowerCase().includes(q) ?? false)
        )
      : entries;

    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'rank':
          cmp = a.rank - b.rank;
          break;
        case 'team':
          cmp = a.team.name.localeCompare(b.team.name);
          break;
        case 'date':
          cmp = a.referenceTimestampMs - b.referenceTimestampMs;
          break;
        case 'era':
          cmp = a.era.order - b.era.order || a.rank - b.rank;
          break;
        case 'drought':
          cmp = a.droughtMs - b.droughtMs;
          break;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return sorted;
  }, [entries, searchQuery, sortField, sortDirection]);

  const hasActiveFilter =
    activeEra !== 'ALL' || activeConference !== 'ALL' || searchQuery.trim().length > 0;

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-[#484F58] group-hover:text-[#8B949E]" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-[#00F0FF]" />
    ) : (
      <ArrowDown className="h-3 w-3 text-[#00F0FF]" />
    );
  };

  return (
    <section aria-label="All 32 NFL Teams Drought Leaderboard">
      <div className="overflow-hidden rounded border border-[#30363D] bg-[#161B22]">
        {/* Table Toolbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363D] px-4 sm:px-5 py-3.5 bg-[#161B22]">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="font-display text-base sm:text-lg font-bold tracking-tight text-[#F0F6FC]">
              All 32 NFL Teams Drought Leaderboard
            </h2>
            <span className="font-mono text-xs text-[#8B949E]">
              {milestoneMeta.label} <span aria-hidden="true">·</span>{' '}
              <span className="text-[#F0F6FC] tabular-nums">{displayedEntries.length}</span> shown
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8B949E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter table..."
                aria-label="Filter leaderboard by team, division, or opponent"
                className="vice-input h-8 w-full rounded-[3px] border border-[#30363D] bg-[#0D1117] pl-8 pr-7 text-xs text-[#F0F6FC] placeholder:text-[#484F58]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8B949E] hover:text-[#F0F6FC] cursor-pointer"
                  aria-label="Clear table filter"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {hasActiveFilter && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onResetFilters();
                }}
                className="flex h-8 items-center gap-1.5 rounded-[3px] border border-[#30363D] bg-[#0D1117] px-2.5 font-mono text-[11px] font-semibold text-[#8B949E] hover:border-[#00F0FF] hover:text-[#00F0FF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#30363D] bg-[#0D1117] font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8B949E]">
                <th scope="col" className="w-16 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleSort('rank')}
                    className="group inline-flex items-center gap-1.5 hover:text-[#F0F6FC] cursor-pointer whitespace-nowrap"
                  >
                    <span>Rank</span>
                    {renderSortIcon('rank')}
                  </button>
                </th>
                <th scope="col" className="px-4 py-3 min-w-[230px]">
                  <button
                    type="button"
                    onClick={() => handleSort('team')}
                    className="group inline-flex items-center gap-1.5 hover:text-[#F0F6FC] cursor-pointer whitespace-nowrap"
                  >
                    <span>Team</span>
                    {renderSortIcon('team')}
                  </button>
                </th>
                <th scope="col" className="px-4 py-3 min-w-[140px]">
                  <button
                    type="button"
                    onClick={() => handleSort('date')}
                    className="group inline-flex items-center gap-1.5 hover:text-[#F0F6FC] cursor-pointer whitespace-nowrap"
                  >
                    <span>Last Milestone Date</span>
                    {renderSortIcon('date')}
                  </button>
                </th>
                <th scope="col" className="px-4 py-3 min-w-[220px]">
                  <span className="whitespace-nowrap">Opponent &amp; Result</span>
                </th>
                <th scope="col" className="px-4 py-3 min-w-[160px]">
                  <button
                    type="button"
                    onClick={() => handleSort('era')}
                    className="group inline-flex items-center gap-1.5 hover:text-[#F0F6FC] cursor-pointer whitespace-nowrap"
                  >
                    <span>Active GTA Era</span>
                    {renderSortIcon('era')}
                  </button>
                </th>
                <th scope="col" className="px-4 py-3 text-right min-w-[190px]">
                  <button
                    type="button"
                    onClick={() => handleSort('drought')}
                    className="group inline-flex items-center justify-end gap-1.5 hover:text-[#F0F6FC] cursor-pointer whitespace-nowrap ml-auto"
                  >
                    <span>Total Drought Length</span>
                    {renderSortIcon('drought')}
                  </button>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#30363D]/60 text-sm">
              {displayedEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="font-display text-base font-semibold text-[#F0F6FC]">
                      No NFL franchises in this slice
                    </p>
                    <p className="mt-1 text-xs text-[#8B949E]">
                      {activeEra !== 'ALL'
                        ? `Zero teams are currently frozen in the ${GTA_ERA_MAP[activeEra].eraBadge} for ${milestoneMeta.label}.`
                        : 'Try clearing your search query or conference filter.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        onResetFilters();
                      }}
                      className="mt-4 inline-flex items-center gap-2 rounded bg-[#00F0FF] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#0D1117] hover:bg-[#FF2A85] hover:text-white transition-colors cursor-pointer"
                    >
                      Show All 32 Teams
                    </button>
                  </td>
                </tr>
              ) : (
                displayedEntries.map((entry) => {
                  const { team, record, isNever, era, rank } = entry;
                  const isSelected = team.abbr === selectedTeamAbbr;
                  const duration = computeLiveDuration(entry.referenceTimestampMs, nowMs);
                  const shortDrought = formatShortDrought(duration);
                  const barPct =
                    allEntriesMaxDroughtMs > 0
                      ? Math.max(4, Math.min(100, (entry.droughtMs / allEntriesMaxDroughtMs) * 100))
                      : 10;

                  return (
                    <tr
                      key={team.abbr}
                      onClick={() => {
                        onSelectTeam(team.abbr);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectTeam(team.abbr);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Inspect ${team.name} drought details`}
                      className={`group relative cursor-pointer transition-colors duration-100 focus-visible:outline-none focus-visible:bg-[#21262D] ${
                        isSelected ? 'bg-[#21262D]/90' : 'hover:bg-[#21262D]'
                      }`}
                    >
                      {/* Rank Column with absolute 2px Cyan hover/active left edge strip */}
                      <td className="relative px-4 py-3 font-mono text-xs tabular-nums">
                        <span
                          aria-hidden="true"
                          className={`absolute inset-y-0 left-0 w-[2px] transition-opacity duration-100 ${
                            isSelected
                              ? 'bg-[#00F0FF] opacity-100'
                              : 'bg-[#00F0FF] opacity-0 group-hover:opacity-100'
                          }`}
                        />
                        <span
                          className={`font-bold ${
                            rank === 1
                              ? 'text-[#FF2A85]'
                              : rank <= 3
                              ? 'text-[#FACC15]'
                              : 'text-[#8B949E]'
                          }`}
                        >
                          {pad2(rank)}
                        </span>
                      </td>

                      {/* Team Column (Color swatch + Team Name + Division) */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="h-5 w-1.5 rounded-[1px] shrink-0"
                            style={{ backgroundColor: team.primaryColor }}
                            aria-hidden="true"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-[#F0F6FC] group-hover:text-white truncate">
                                {team.name}
                              </span>
                              {team.superBowlWins === 0 && activeMilestone === 'sb_win' && (
                                <span className="sr-only">Never won a Super Bowl</span>
                              )}
                              {isSelected && (
                                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#00F0FF]">
                                  Active
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-[#8B949E]">
                              <span className="font-mono">{team.abbr}</span>
                              <span aria-hidden="true">·</span>
                              <span>{team.division}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Last Milestone Date */}
                      <td className="px-4 py-3 font-mono text-xs tabular-nums whitespace-nowrap">
                        {isNever ? (
                          <span className="text-[#FF6AA8] font-semibold">
                            Never ({team.foundedYear < 1967 ? '1967' : team.foundedYear})
                          </span>
                        ) : (
                          <span className="text-[#F0F6FC]">{formatShortDate(record.date!)}</span>
                        )}
                      </td>

                      {/* Opponent & Result */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isNever ? (
                          <span className="retro-stamp inline-block rounded-[2px] border-[1.5px] border-[#FF2A85] bg-[#FF2A85]/12 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#FF2A85]">
                            {milestoneMeta.neverLabel}
                          </span>
                        ) : (
                          <div className="flex items-center gap-2 text-xs">
                            <span
                              className={`font-mono font-bold ${
                                record.outcome === 'W' ? 'text-[#00F0FF]' : 'text-[#FF6AA8]'
                              }`}
                            >
                              {record.outcome} {record.score}
                            </span>
                            <span className="text-[#B9CACB]">
                              {record.location} {record.opponentAbbr}
                            </span>
                            <span className="text-[#484F58]" aria-hidden="true">
                              ·
                            </span>
                            <span className="text-[11px] text-[#8B949E]">{record.round}</span>
                          </div>
                        )}
                      </td>

                      {/* Active GTA Game Era */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-[2px] border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide"
                          style={{
                            borderColor: era.borderTint,
                            backgroundColor: era.bgTint,
                            color: era.textHex,
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-[1px]"
                            style={{ backgroundColor: era.accentHex }}
                            aria-hidden="true"
                          />
                          {era.eraBadge}
                        </span>
                      </td>

                      {/* Total Drought Length + proportional misery bar */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex flex-col items-end gap-1 min-w-[140px]">
                          <div className="flex items-baseline gap-2 font-mono tabular-nums">
                            <span className="text-xs font-semibold text-[#F0F6FC]">
                              {shortDrought}
                            </span>
                            <span className="text-[11px] text-[#8B949E]">
                              {duration.days.toLocaleString('en-US')}d
                            </span>
                          </div>
                          <div className="h-1 w-28 overflow-hidden rounded-[1px] bg-[#0D1117]">
                            <div
                              className="h-full rounded-[1px] transition-all duration-300"
                              style={{
                                width: `${barPct}%`,
                                backgroundColor: isNever ? '#FF2A85' : era.accentHex,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Attribution & Legend */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-[#30363D] bg-[#0D1117] px-4 sm:px-5 py-3 text-xs text-[#8B949E]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>
              Automated postseason game records structured via{' '}
              <strong className="font-mono text-[#F0F6FC] font-medium">nflverse</strong> historical
              archives
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px]">Updated through Super Bowl LX (Feb 8, 2026)</span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="retro-stamp inline-block rounded-[2px] border border-[#FF2A85] bg-[#FF2A85]/12 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#FF2A85]">
              NEVER WON
            </span>
            <span className="text-[11px] text-[#8B949E]">
              Franchise with 0 Super Bowl titles (12 active teams)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
