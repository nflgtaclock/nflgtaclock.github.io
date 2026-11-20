import React, { useState } from 'react';
import { Check, Link2, Share2, Trophy } from 'lucide-react';
import { GTA_ERAS, GtaEraId } from '../data/gtaEras';
import { MILESTONE_OPTIONS, MilestoneKey } from '../data/nflTeams';
import {
  TeamDroughtEntry,
  computeLiveDuration,
  formatLongDate,
  formatShortDate,
  formatShortDrought,
  pad2,
} from '../utils/droughtMath';

interface HeroSpotlightProps {
  entry: TeamDroughtEntry;
  nowMs: number;
  activeMilestone: MilestoneKey;
  onSelectMilestone: (m: MilestoneKey) => void;
  onFilterByEra: (eraId: GtaEraId) => void;
  onCopyShareLink: () => void;
  onOpenShareModal: () => void;
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({
  entry,
  nowMs,
  activeMilestone,
  onSelectMilestone,
  onFilterByEra,
  onCopyShareLink,
  onOpenShareModal,
}) => {
  const [copied, setCopied] = useState(false);

  const { team, record, isNever, era, subsequentGtaReleases, rank } = entry;
  const milestoneMeta =
    MILESTONE_OPTIONS.find((m) => m.key === activeMilestone) ?? MILESTONE_OPTIONS[0];

  const duration = computeLiveDuration(entry.referenceTimestampMs, nowMs);
  const formattedElapsed = formatShortDrought(duration);

  const handleCopyClick = () => {
    onCopyShareLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Secondary context milestone for quick comparison
  const altMilestoneKey: MilestoneKey =
    activeMilestone === 'playoff_game' ? 'playoff_win' : 'playoff_game';
  const altMilestoneLabel =
    altMilestoneKey === 'playoff_win' ? 'Last Playoff Win' : 'Last Playoff Game';
  const altRecord = team.milestones[altMilestoneKey];

  const subsequentNames = subsequentGtaReleases.map((e) => e.shortLabel).join(', ');

  return (
    <section aria-label="Active Team Misery Spotlight" className="relative">
      {/* Editorial subtitle bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#8B949E]">
        <p className="text-[#8B949E]">
          Measuring NFL franchise misery in Grand Theft Auto release eras
        </p>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#8B949E]">
          <span>ACTIVE SPOTLIGHT</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#F0F6FC] font-semibold">
            RANK #{pad2(rank)} OF 32
          </span>
        </div>
      </div>

      {/* Main Two-Column Spotlight Card */}
      <div className="relative overflow-hidden rounded border border-[#30363D] bg-[#161B22]">
        {/* Crisp top team-color accent bar */}
        <div
          className="h-[3px] w-full"
          style={{
            background: `linear-gradient(90deg, ${team.primaryColor} 0%, ${era.accentHex} 65%, #30363D 100%)`,
          }}
        />

        {/* Subtle ambient team-color radial sheen in top-left */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: team.primaryColor }}
          aria-hidden="true"
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* LEFT COLUMN: NFL Milestone & Live Ticking Misery Clock */}
          <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between gap-6">
            {/* Team Header Row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                {/* Team Monogram Shield */}
                <div
                  className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded border border-white/15 font-display shadow-inner"
                  style={{
                    backgroundColor: team.primaryColor,
                  }}
                >
                  <span className="text-lg font-bold tracking-tight text-white drop-shadow-sm">
                    {team.abbr}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#8B949E]">
                    <span className="font-mono font-semibold text-[#F0F6FC]/90">
                      {team.division}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{team.city}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-[#8B949E]" />
                      {team.superBowlWins === 0
                        ? '0 Super Bowls'
                        : `${team.superBowlWins}× Super Bowl Champ`}
                    </span>
                  </div>
                  <h1 className="mt-1 font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#F0F6FC] leading-tight">
                    {team.name}
                  </h1>
                </div>
              </div>

              {/* Rank Callout */}
              <div className="hidden sm:flex flex-col items-end shrink-0 text-right">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#8B949E]">
                  Misery Rank
                </span>
                <span
                  className={`font-mono text-2xl font-bold tabular-nums leading-none mt-1 ${
                    rank === 1
                      ? 'text-[#FF2A85]'
                      : rank <= 5
                      ? 'text-[#FACC15]'
                      : 'text-[#F0F6FC]'
                  }`}
                >
                  #{pad2(rank)}
                </span>
              </div>
            </div>

            {/* Milestone Date & Game Result */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#00F0FF]">
                  {milestoneMeta.uppercaseLabel}
                </span>
                <span className="font-mono text-sm sm:text-base font-semibold text-[#F0F6FC] tabular-nums">
                  {isNever
                    ? `Never (Since ${formatLongDate(team.sbEraStartDate)})`
                    : formatLongDate(record.date!)}
                </span>
              </div>

              {/* Game Result Line or Never Won Stamp */}
              {isNever ? (
                <div className="flex flex-wrap items-center gap-3 rounded bg-[#0D1117] border border-[#FF2A85]/40 px-3.5 py-2.5">
                  <span className="retro-stamp inline-block rounded-[2px] border-[1.5px] border-[#FF2A85] bg-[#FF2A85]/12 px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#FF2A85]">
                    {milestoneMeta.neverLabel}
                  </span>
                  <span className="text-xs sm:text-sm text-[#8B949E]">
                    Franchise has zero appearances in this milestone since{' '}
                    <span className="font-mono text-[#F0F6FC]">
                      {team.foundedYear < 1967 ? 'Super Bowl I (1967)' : team.foundedYear}
                    </span>
                    .
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2.5 rounded bg-[#0D1117] border border-[#30363D] px-3.5 py-2.5 text-xs sm:text-sm">
                  <span
                    className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded-[2px] ${
                      record.outcome === 'W'
                        ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/35'
                        : 'bg-[#FF2A85]/15 text-[#FF6AA8] border border-[#FF2A85]/35'
                    }`}
                  >
                    {record.outcome} {record.score}
                  </span>
                  <span className="text-[#F0F6FC] font-medium">
                    {record.location} {record.opponentName}
                  </span>
                  <span className="text-[#484F58]" aria-hidden="true">
                    ·
                  </span>
                  <span className="font-mono text-xs text-[#8B949E]">{record.round}</span>
                </div>
              )}
            </div>

            {/* Live Ticking Digital Countdown Clock */}
            <div className="rounded border border-[#30363D] bg-[#0D1117] p-4 sm:p-5">
              <div className="mb-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.12em] text-[#8B949E]">
                <span>
                  {isNever ? 'Elapsed Franchise Wait' : 'Elapsed Drought Clock'}
                </span>
                <span className="text-[#F0F6FC]">{formattedElapsed}</span>
              </div>

              <div
                className="grid grid-cols-4 gap-2 sm:gap-3 items-baseline"
                aria-live="off"
              >
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-2xl sm:text-4xl font-bold tracking-tight text-[#F0F6FC] tabular-nums">
                      {duration.days.toLocaleString('en-US')}
                    </span>
                  </div>
                  <span className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#8B949E]">
                    Days
                  </span>
                </div>

                <div className="flex flex-col border-l border-[#30363D] pl-2.5 sm:pl-4">
                  <span className="font-mono text-2xl sm:text-4xl font-bold tracking-tight text-[#F0F6FC] tabular-nums">
                    {pad2(duration.hours)}
                  </span>
                  <span className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#8B949E]">
                    Hrs
                  </span>
                </div>

                <div className="flex flex-col border-l border-[#30363D] pl-2.5 sm:pl-4">
                  <span className="font-mono text-2xl sm:text-4xl font-bold tracking-tight text-[#F0F6FC] tabular-nums">
                    {pad2(duration.minutes)}
                  </span>
                  <span className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#8B949E]">
                    Min
                  </span>
                </div>

                <div className="flex flex-col border-l border-[#30363D] pl-2.5 sm:pl-4">
                  <span className="font-mono text-2xl sm:text-4xl font-bold tracking-tight text-[#00F0FF] tabular-nums">
                    {pad2(duration.seconds)}
                  </span>
                  <span className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#00F0FF]/80">
                    Sec
                  </span>
                </div>
              </div>
            </div>

            {/* Quiet cross-milestone context bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#8B949E] pt-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{altMilestoneLabel}:</span>
                <button
                  type="button"
                  onClick={() => onSelectMilestone(altMilestoneKey)}
                  className="font-mono text-[#F0F6FC] underline decoration-[#30363D] underline-offset-4 hover:text-[#00F0FF] hover:decoration-[#00F0FF] transition-colors cursor-pointer"
                >
                  {altRecord.date ? formatShortDate(altRecord.date) : 'Never'}
                </button>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span>SB Titles:</span>
                <span
                  className={
                    team.superBowlWins === 0 ? 'text-[#FF6AA8] font-semibold' : 'text-[#F0F6FC]'
                  }
                >
                  {team.superBowlWins === 0 ? 'NEVER WON' : team.superBowlWins}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Pop-Culture Era Stamp (Retro GTA Cover-Art Panel) */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[#30363D] p-6 sm:p-7 flex flex-col justify-between gap-5 bg-[#12161D]">
            {/* Stylized Rockstar Game-Case Mosaic Box */}
            <div className="relative overflow-hidden rounded border border-[#30363D] bg-[#0D1117]">
              {/* 4-Panel Comic Mosaic Art Backdrop */}
              <div
                className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px] bg-[#0D1117] opacity-85"
                aria-hidden="true"
              >
                <div style={{ backgroundColor: era.coverPanels[0] }} className="gta-grid-pattern" />
                <div style={{ backgroundColor: era.coverPanels[1] }} className="gta-grid-pattern" />
                <div style={{ backgroundColor: era.coverPanels[2] }} className="gta-grid-pattern" />
                <div style={{ backgroundColor: era.coverPanels[3] }} className="gta-grid-pattern" />
              </div>

              {/* Scrim for guaranteed WCAG AA legibility */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/82 to-[#0D1117]/45"
                aria-hidden="true"
              />

              <div className="relative p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="retro-stamp inline-block rounded-[2px] border-[1.5px] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest"
                    style={{
                      borderColor: era.accentHex,
                      backgroundColor: era.bgTint,
                      color: era.textHex,
                    }}
                  >
                    ACTIVE ERA
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#8B949E]">
                    {era.setting}
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#F0F6FC] leading-snug">
                    {era.fullTitle}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-[#B9CACB]">
                    {era.releaseDisplay} <span aria-hidden="true">·</span> {era.platforms}
                  </p>
                </div>

                <p className="text-xs leading-relaxed text-[#8B949E] border-t border-white/10 pt-2.5">
                  {era.tagline}
                </p>
              </div>
            </div>

            {/* Visual Era Progression Bar */}
            <div className="space-y-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#8B949E]">
                  GTA Release Progression
                </span>
                <span className="font-mono text-xs font-bold text-[#F0F6FC] tabular-nums">
                  {subsequentGtaReleases.length === 0
                    ? '0 Releases Since (Active)'
                    : `${subsequentGtaReleases.length} Mainline ${
                        subsequentGtaReleases.length === 1 ? 'Release' : 'Releases'
                      } Since`}
                </span>
              </div>

              {/* 9-Era Interactive Segment Bar */}
              <div className="grid grid-cols-9 gap-1" role="group" aria-label="GTA Era Timeline">
                {GTA_ERAS.map((node) => {
                  const isCurrentEra = node.id === era.id;
                  const isLaunchedSince = node.order > era.order;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => onFilterByEra(node.id)}
                      title={`Filter leaderboard by ${node.eraBadge} (${node.releaseDisplay})`}
                      className="group flex flex-col items-center gap-1.5 cursor-pointer focus-visible:outline-none"
                    >
                      <div
                        className={`h-2.5 w-full rounded-[2px] transition-all duration-150 ${
                          isCurrentEra
                            ? 'ring-1 ring-white/70 scale-y-110'
                            : isLaunchedSince
                            ? 'bg-[#FF2A85]/70 group-hover:bg-[#FF2A85]'
                            : 'bg-[#262A31] group-hover:bg-[#3B424D]'
                        }`}
                        style={
                          isCurrentEra
                            ? {
                                backgroundColor: era.accentHex,
                                boxShadow: `0 0 10px ${era.accentHex}66`,
                              }
                            : undefined
                        }
                      />
                      <span
                        className={`font-mono text-[9px] uppercase tracking-tight transition-colors ${
                          isCurrentEra
                            ? 'text-[#F0F6FC] font-bold'
                            : isLaunchedSince
                            ? 'text-[#FF6AA8]'
                            : 'text-[#484F58] group-hover:text-[#8B949E]'
                        }`}
                      >
                        {node.id === 'pre_gta'
                          ? 'Pre'
                          : node.id === 'vice_city'
                          ? 'VC'
                          : node.id === 'san_andreas'
                          ? 'SA'
                          : node.shortLabel.replace('GTA ', '')}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-[#8B949E]">
                {subsequentGtaReleases.length === 0 ? (
                  <span>
                    Active in the <strong className="text-[#00F0FF]">2025–26 postseason</strong>{' '}
                    cycle. No new mainline GTA has launched since.
                  </span>
                ) : (
                  <span>
                    Launched since that game:{' '}
                    <span className="font-mono text-[#F0F6FC]">{subsequentNames}</span>.
                  </span>
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleCopyClick}
                className="flex-1 flex h-10 items-center justify-center gap-2 rounded bg-[#00F0FF] px-4 font-mono text-xs font-bold uppercase tracking-wider text-[#0D1117] hover:bg-[#FF2A85] hover:text-white transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF]"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Link2 className="h-3.5 w-3.5" />
                    <span>Copy Share Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onOpenShareModal}
                className="flex h-10 items-center justify-center gap-2 rounded border border-[#30363D] bg-transparent px-4 font-mono text-xs font-semibold uppercase tracking-wider text-[#F0F6FC] hover:border-[#00F0FF] hover:text-[#00F0FF] transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF]"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Card Preview</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
