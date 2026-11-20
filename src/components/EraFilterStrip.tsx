import React from 'react';
import { GTA_ERAS, GtaEraId } from '../data/gtaEras';
import { Conference } from '../data/nflTeams';

export type ConferenceFilter = 'ALL' | Conference;
export type EraFilter = 'ALL' | GtaEraId;

interface EraFilterStripProps {
  activeEra: EraFilter;
  onSelectEra: (era: EraFilter) => void;
  eraCounts: Record<GtaEraId, number>;
  totalInConference: number;
  activeConference: ConferenceFilter;
  onSelectConference: (conf: ConferenceFilter) => void;
}

export const EraFilterStrip: React.FC<EraFilterStripProps> = ({
  activeEra,
  onSelectEra,
  eraCounts,
  totalInConference,
  activeConference,
  onSelectConference,
}) => {
  return (
    <section
      aria-label="Filter by GTA Era and NFL Conference"
      className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"
    >
      {/* Left: Horizontal scrollable GTA Era filter buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
        <button
          type="button"
          onClick={() => onSelectEra('ALL')}
          className={`flex h-9 items-center gap-2 rounded border px-3 font-mono text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] ${
            activeEra === 'ALL'
              ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.18)]'
              : 'border-[#30363D] bg-[#161B22] text-[#F0F6FC] hover:border-[#8B949E] hover:bg-[#21262D]'
          }`}
          aria-pressed={activeEra === 'ALL'}
        >
          <span>All {totalInConference} Teams</span>
        </button>

        {GTA_ERAS.map((era) => {
          const count = eraCounts[era.id] ?? 0;
          const isActive = activeEra === era.id;
          const isZero = count === 0;

          return (
            <button
              key={era.id}
              type="button"
              onClick={() => onSelectEra(isActive ? 'ALL' : era.id)}
              className={`flex h-9 items-center gap-2 rounded border px-3 font-mono text-xs transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] ${
                isActive
                  ? 'font-bold bg-[#21262D] text-[#F0F6FC]'
                  : isZero
                  ? 'border-[#30363D]/60 bg-[#161B22]/60 text-[#484F58] hover:border-[#30363D] hover:text-[#8B949E]'
                  : 'border-[#30363D] bg-[#161B22] text-[#B9CACB] hover:border-[#8B949E] hover:bg-[#21262D] hover:text-[#F0F6FC]'
              }`}
              style={
                isActive
                  ? {
                      borderColor: era.accentHex,
                      boxShadow: `0 0 10px ${era.accentHex}33`,
                    }
                  : undefined
              }
              aria-pressed={isActive}
            >
              <span
                className="h-2 w-2 rounded-[1px] shrink-0"
                style={{
                  backgroundColor: isZero && !isActive ? '#484F58' : era.accentHex,
                }}
                aria-hidden="true"
              />
              <span>{era.chipLabel}</span>
              <span
                className={`tabular-nums ${
                  isActive
                    ? 'text-[#F0F6FC]'
                    : isZero
                    ? 'text-[#484F58]'
                    : 'text-[#8B949E]'
                }`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Right: Conference Toggle [All | AFC | NFC] */}
      <div
        role="group"
        aria-label="Filter by NFL Conference"
        className="inline-flex self-start lg:self-auto items-center rounded border border-[#30363D] bg-[#161B22] p-1 shrink-0"
      >
        {(['ALL', 'AFC', 'NFC'] as ConferenceFilter[]).map((conf) => {
          const isActive = activeConference === conf;
          return (
            <button
              key={conf}
              type="button"
              onClick={() => onSelectConference(conf)}
              className={`px-3 py-1 font-mono text-xs font-semibold rounded-[3px] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F0FF] ${
                isActive
                  ? conf === 'AFC'
                    ? 'bg-[#FF2A85] text-white'
                    : conf === 'NFC'
                    ? 'bg-[#00F0FF] text-[#0D1117]'
                    : 'bg-[#262A31] text-[#F0F6FC]'
                  : 'text-[#8B949E] hover:text-[#F0F6FC]'
              }`}
              aria-pressed={isActive}
            >
              {conf === 'ALL' ? 'All' : conf}
            </button>
          );
        })}
      </div>
    </section>
  );
};
