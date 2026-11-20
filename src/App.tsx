import { useCallback, useEffect, useMemo, useState } from 'react';
import { GTA_ERAS, GtaEraId } from './data/gtaEras';
import { MILESTONE_OPTIONS, MilestoneKey, NFL_TEAMS } from './data/nflTeams';
import { buildRankedEntries } from './utils/droughtMath';
import { TopNav } from './components/TopNav';
import { HeroSpotlight } from './components/HeroSpotlight';
import { ConferenceFilter, EraFilter, EraFilterStrip } from './components/EraFilterStrip';
import { DroughtLeaderboard } from './components/DroughtLeaderboard';
import { ShareCardModal } from './components/ShareCardModal';

function getInitialParams(): { team: string; milestone: MilestoneKey } {
  if (typeof window === 'undefined') {
    return { team: 'NYJ', milestone: 'playoff_game' };
  }
  const params = new URLSearchParams(window.location.search);
  const paramTeam = params.get('team')?.toUpperCase();
  const validTeam = NFL_TEAMS.some((t) => t.abbr === paramTeam) ? paramTeam! : 'NYJ';

  const paramMilestone = params.get('milestone') as MilestoneKey | null;
  const validMilestone = MILESTONE_OPTIONS.some((m) => m.key === paramMilestone)
    ? paramMilestone!
    : 'playoff_game';

  return { team: validTeam, milestone: validMilestone };
}

export default function App() {
  const initial = useMemo(() => getInitialParams(), []);
  const [activeMilestone, setActiveMilestone] = useState<MilestoneKey>(initial.milestone);
  const [selectedTeamAbbr, setSelectedTeamAbbr] = useState<string>(initial.team);
  const [activeEra, setActiveEra] = useState<EraFilter>('ALL');
  const [activeConference, setActiveConference] = useState<ConferenceFilter>('ALL');
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Live 1-second digital clock tick
  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Sync URL query params seamlessly without reload
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('team', selectedTeamAbbr);
    url.searchParams.set('milestone', activeMilestone);
    window.history.replaceState({}, '', url.toString());
  }, [selectedTeamAbbr, activeMilestone]);

  // Rank all 32 teams for the active milestone
  const rankedEntries = useMemo(
    () => buildRankedEntries(activeMilestone, nowMs),
    // Re-rank only when milestone changes (avoid re-sorting 32 rows every second; live clock reads nowMs directly)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeMilestone]
  );

  // Longest drought duration in this milestone (for proportional leaderboard bars)
  const maxDroughtMs = useMemo(() => {
    return rankedEntries.reduce((max, e) => Math.max(max, e.droughtMs), 1);
  }, [rankedEntries]);

  // Conference-filtered entries (used to compute live GTA era chip counts)
  const conferenceEntries = useMemo(() => {
    if (activeConference === 'ALL') return rankedEntries;
    return rankedEntries.filter((e) => e.team.conference === activeConference);
  }, [rankedEntries, activeConference]);

  const eraCounts = useMemo(() => {
    const counts = {} as Record<GtaEraId, number>;
    for (const era of GTA_ERAS) {
      counts[era.id] = 0;
    }
    for (const entry of conferenceEntries) {
      counts[entry.era.id] = (counts[entry.era.id] ?? 0) + 1;
    }
    return counts;
  }, [conferenceEntries]);

  // Final filtered entries for the leaderboard
  const filteredEntries = useMemo(() => {
    if (activeEra === 'ALL') return conferenceEntries;
    return conferenceEntries.filter((e) => e.era.id === activeEra);
  }, [conferenceEntries, activeEra]);

  // Spotlighted team entry
  const spotlightEntry = useMemo(
    () =>
      rankedEntries.find((e) => e.team.abbr === selectedTeamAbbr) ?? rankedEntries[0],
    [rankedEntries, selectedTeamAbbr]
  );

  // When switching milestones, clear era filter so users immediately see the new distribution
  const handleSelectMilestone = useCallback((milestone: MilestoneKey) => {
    setActiveMilestone(milestone);
    setActiveEra('ALL');
  }, []);

  const handleSelectTeam = useCallback((abbr: string) => {
    setSelectedTeamAbbr(abbr);
  }, []);

  const handleFilterByEra = useCallback((eraId: GtaEraId) => {
    setActiveEra((prev) => (prev === eraId ? 'ALL' : eraId));
  }, []);

  const handleResetFilters = useCallback(() => {
    setActiveEra('ALL');
    setActiveConference('ALL');
  }, []);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('team', selectedTeamAbbr);
    url.searchParams.set('milestone', activeMilestone);
    return url.toString();
  }, [selectedTeamAbbr, activeMilestone]);

  const handleCopyShareLink = useCallback(() => {
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
  }, [shareUrl]);

  return (
    <div id="top" className="min-h-screen bg-[#0D1117] text-[#F0F6FC] flex flex-col">
      <TopNav
        activeMilestone={activeMilestone}
        onSelectMilestone={handleSelectMilestone}
        selectedTeamAbbr={selectedTeamAbbr}
        onSelectTeam={handleSelectTeam}
        onOpenShareModal={() => setShareModalOpen(true)}
      />

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <HeroSpotlight
          entry={spotlightEntry}
          nowMs={nowMs}
          activeMilestone={activeMilestone}
          onSelectMilestone={handleSelectMilestone}
          onFilterByEra={handleFilterByEra}
          onCopyShareLink={handleCopyShareLink}
          onOpenShareModal={() => setShareModalOpen(true)}
        />

        <EraFilterStrip
          activeEra={activeEra}
          onSelectEra={setActiveEra}
          eraCounts={eraCounts}
          totalInConference={conferenceEntries.length}
          activeConference={activeConference}
          onSelectConference={setActiveConference}
        />

        <DroughtLeaderboard
          entries={filteredEntries}
          allEntriesMaxDroughtMs={maxDroughtMs}
          nowMs={nowMs}
          activeMilestone={activeMilestone}
          selectedTeamAbbr={selectedTeamAbbr}
          onSelectTeam={handleSelectTeam}
          activeEra={activeEra}
          activeConference={activeConference}
          onResetFilters={handleResetFilters}
        />
      </main>

      <footer className="border-t border-[#30363D] bg-[#0D1117] py-5">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#484F58]">
          <p className="font-mono">
            Droughts in Vice &amp; Liberty · NFL Postseason Misery × Grand Theft Auto Era Chronology
          </p>
          <p>
            GTA mainline release dates: GTA 1 (1997) through GTA VI (2026) · Click any team row to
            update spotlight
          </p>
        </div>
      </footer>

      <ShareCardModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        entry={spotlightEntry}
        nowMs={nowMs}
        activeMilestone={activeMilestone}
        shareUrl={shareUrl}
      />
    </div>
  );
}
