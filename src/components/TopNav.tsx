import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search, Share2, X } from 'lucide-react';
import { MILESTONE_OPTIONS, MilestoneKey, NFL_TEAMS, NflTeam } from '../data/nflTeams';

interface TopNavProps {
  activeMilestone: MilestoneKey;
  onSelectMilestone: (milestone: MilestoneKey) => void;
  selectedTeamAbbr: string;
  onSelectTeam: (abbr: string) => void;
  onOpenShareModal: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeMilestone,
  onSelectMilestone,
  selectedTeamAbbr,
  onSelectTeam,
  onOpenShareModal,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedTeam = useMemo(
    () => NFL_TEAMS.find((t) => t.abbr === selectedTeamAbbr) ?? NFL_TEAMS[0],
    [selectedTeamAbbr]
  );

  const filteredTeams = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...NFL_TEAMS].sort((a, b) => a.name.localeCompare(b.name));
    if (!q) return sorted;
    return sorted.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.abbr.toLowerCase().includes(q) ||
        t.division.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (dropdownOpen) {
      setTimeout(() => inputRef.current?.focus(), 20);
    } else {
      setQuery('');
    }
  }, [dropdownOpen]);

  const handleChooseTeam = (team: NflTeam) => {
    onSelectTeam(team.abbr);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#30363D] bg-[#0D1117]/95 backdrop-blur-md">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Brand Wordmark with subtle neon magenta/cyan badge */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] rounded"
          >
            <div
              className="relative flex h-8 w-8 items-center justify-center rounded-[3px] border border-[#30363D] bg-[#161B22] overflow-hidden shrink-0"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF2A85]/35 via-transparent to-[#00F0FF]/35" />
              <span className="relative font-display text-xs font-bold tracking-tight text-[#F0F6FC]">
                V<span className="text-[#FF2A85]">&amp;</span>
                <span className="text-[#00F0FF]">L</span>
              </span>
            </div>
            <span className="font-display text-base sm:text-lg font-bold tracking-tight text-[#F0F6FC] whitespace-nowrap">
              Droughts in <span className="text-[#FF2A85]">Vice</span>{' '}
              <span className="text-[#8B949E]">&amp;</span>{' '}
              <span className="text-[#00F0FF]">Liberty</span>
            </span>
          </a>

          {/* Center: Desktop Milestone Switcher */}
          <nav
            aria-label="NFL Postseason Milestones"
            className="hidden xl:flex items-center gap-1 rounded bg-[#161B22] p-1 border border-[#30363D]"
          >
            {MILESTONE_OPTIONS.map((m) => {
              const isActive = m.key === activeMilestone;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => onSelectMilestone(m.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-[3px] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] ${
                    isActive
                      ? 'bg-[#00F0FF] text-[#0D1117] font-bold shadow-[0_0_12px_rgba(0,240,255,0.28)]'
                      : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]'
                  }`}
                  aria-pressed={isActive}
                >
                  {m.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Quick Team Jump Dropdown + Share Card CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex h-9 items-center gap-2 rounded border border-[#30363D] bg-[#161B22] px-3 text-xs font-medium text-[#F0F6FC] hover:border-[#00F0FF] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF]"
                aria-expanded={dropdownOpen}
                aria-haspopup="listbox"
              >
                <span
                  className="h-2.5 w-2.5 rounded-[2px] shrink-0 border border-white/20"
                  style={{ backgroundColor: selectedTeam.primaryColor }}
                />
                <span className="hidden sm:inline text-[#8B949E]">Jump to:</span>
                <span className="font-mono font-semibold text-[#F0F6FC]">
                  {selectedTeam.abbr}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[#8B949E] transition-transform duration-150 ${
                    dropdownOpen ? 'rotate-180 text-[#00F0FF]' : ''
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded border border-[#8B949E]/50 bg-[#161B22] shadow-2xl overflow-hidden z-50">
                  <div className="p-2 border-b border-[#30363D] bg-[#0D1117]">
                    <div className="relative flex items-center">
                      <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-[#8B949E]" />
                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Jump to NFL Team (e.g. Jets, MIA)..."
                        className="vice-input w-full rounded-[3px] border border-[#30363D] bg-[#161B22] py-1.5 pl-8 pr-7 text-xs text-[#F0F6FC] placeholder:text-[#484F58]"
                      />
                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery('')}
                          className="absolute right-2 text-[#8B949E] hover:text-[#F0F6FC] cursor-pointer"
                          aria-label="Clear search"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div
                    role="listbox"
                    className="max-h-72 overflow-y-auto divide-y divide-[#30363D]/40"
                  >
                    {filteredTeams.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-[#8B949E]">
                        No NFL team matches &ldquo;{query}&rdquo;
                      </div>
                    ) : (
                      filteredTeams.map((team) => {
                        const isSelected = team.abbr === selectedTeamAbbr;
                        return (
                          <button
                            key={team.abbr}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => handleChooseTeam(team)}
                            className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#21262D] text-[#00F0FF]'
                                : 'text-[#F0F6FC] hover:bg-[#21262D]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className="h-3 w-3 rounded-[2px] shrink-0 border border-white/20"
                                style={{ backgroundColor: team.primaryColor }}
                              />
                              <span className="font-medium truncate">{team.name}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <span className="text-[10px] text-[#8B949E]">{team.division}</span>
                              <span className="font-mono text-[11px] font-semibold text-[#8B949E] w-8 text-right">
                                {team.abbr}
                              </span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onOpenShareModal}
              className="flex h-9 items-center gap-1.5 rounded bg-[#00F0FF] px-3.5 text-xs font-mono font-bold uppercase tracking-wider text-[#0D1117] hover:bg-[#FF2A85] hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2A85]"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share Card</span>
            </button>
          </div>
        </div>

        {/* Tablet/Mobile Milestone Switcher Bar (shown below xl) */}
        <div className="xl:hidden pb-2.5 -mx-1 px-1 overflow-x-auto no-scrollbar">
          <nav
            aria-label="NFL Postseason Milestones"
            className="inline-flex items-center gap-1 rounded bg-[#161B22] p-1 border border-[#30363D] min-w-max"
          >
            {MILESTONE_OPTIONS.map((m) => {
              const isActive = m.key === activeMilestone;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => onSelectMilestone(m.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-[3px] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#00F0FF] text-[#0D1117] font-bold'
                      : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]'
                  }`}
                  aria-pressed={isActive}
                >
                  {m.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
