import React, { useEffect, useState } from 'react';
import { Check, Copy, Download, Link2, X } from 'lucide-react';
import { MILESTONE_OPTIONS, MilestoneKey } from '../data/nflTeams';
import {
  TeamDroughtEntry,
  computeLiveDuration,
  formatLongDate,
  formatShortDrought,
  pad2,
} from '../utils/droughtMath';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: TeamDroughtEntry;
  nowMs: number;
  activeMilestone: MilestoneKey;
  shareUrl: string;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  entry,
  nowMs,
  activeMilestone,
  shareUrl,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { team, record, isNever, era, subsequentGtaReleases, rank } = entry;
  const milestoneMeta =
    MILESTONE_OPTIONS.find((m) => m.key === activeMilestone) ?? MILESTONE_OPTIONS[0];
  const duration = computeLiveDuration(entry.referenceTimestampMs, nowMs);
  const shortDrought = formatShortDrought(duration);

  const summaryText = isNever
    ? `${team.name} — ${milestoneMeta.label}: NEVER (${shortDrought} / ${duration.days.toLocaleString()} days waiting). Active Era: ${era.fullTitle}. Tracked on Droughts in Vice & Liberty: ${shareUrl}`
    : `${team.name} — ${milestoneMeta.label}: ${formatLongDate(record.date!)} (${record.outcome} ${record.score} ${record.location} ${record.opponentName}, ${record.round}). ${duration.days.toLocaleString()} days ago — back in the ${era.eraBadge} (${subsequentGtaReleases.length} mainline GTA releases since). ${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Fallback ignored if clipboard blocked
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
    } catch {
      // Fallback ignored
    }
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Obsidian baseplate
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(0, 0, 1200, 630);

    // Card surface
    ctx.fillStyle = '#161B22';
    ctx.fillRect(40, 40, 1120, 550);

    // Crisp 1px border
    ctx.strokeStyle = '#30363D';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 1120, 550);

    // Top accent bar
    const grad = ctx.createLinearGradient(40, 40, 1160, 40);
    grad.addColorStop(0, team.primaryColor);
    grad.addColorStop(0.65, era.accentHex);
    grad.addColorStop(1, '#30363D');
    ctx.fillStyle = grad;
    ctx.fillRect(40, 40, 1120, 6);

    // Subtle team glow
    const rad = ctx.createRadialGradient(140, 140, 10, 140, 140, 320);
    rad.addColorStop(0, `${team.primaryColor}44`);
    rad.addColorStop(1, 'rgba(22,27,34,0)');
    ctx.fillStyle = rad;
    ctx.fillRect(40, 46, 700, 540);

    // Brand kicker
    ctx.fillStyle = '#8B949E';
    ctx.font = '600 18px "JetBrains Mono", monospace';
    ctx.fillText('DROUGHTS IN VICE & LIBERTY', 84, 102);

    ctx.fillStyle = rank === 1 ? '#FF2A85' : '#00F0FF';
    ctx.textAlign = 'right';
    ctx.fillText(`LEAGUE RANK #${pad2(rank)} OF 32`, 1116, 102);
    ctx.textAlign = 'left';

    // Team Badge
    ctx.fillStyle = team.primaryColor;
    ctx.fillRect(84, 134, 72, 72);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.strokeRect(84, 134, 72, 72);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 24px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(team.abbr, 120, 178);
    ctx.textAlign = 'left';

    // Team Name & Division
    ctx.fillStyle = '#8B949E';
    ctx.font = '500 18px "Inter", sans-serif';
    ctx.fillText(`${team.division}  ·  ${team.city}`, 176, 158);
    ctx.fillStyle = '#F0F6FC';
    ctx.font = '700 46px "Space Grotesk", sans-serif';
    ctx.fillText(team.name, 176, 206);

    // Milestone line
    ctx.fillStyle = '#00F0FF';
    ctx.font = '600 16px "JetBrains Mono", monospace';
    ctx.fillText(milestoneMeta.uppercaseLabel, 84, 266);

    ctx.fillStyle = '#F0F6FC';
    ctx.font = '700 28px "JetBrains Mono", monospace';
    const dateLine = isNever
      ? `NEVER (Since ${team.foundedYear < 1967 ? '1967' : team.foundedYear})`
      : formatLongDate(record.date!);
    ctx.fillText(dateLine, 84, 306);

    ctx.fillStyle = '#8B949E';
    ctx.font = '500 19px "Inter", sans-serif';
    const resultLine = isNever
      ? `Franchise has never achieved this milestone`
      : `${record.outcome} ${record.score} ${record.location} ${record.opponentName} (${record.round})`;
    ctx.fillText(resultLine, 84, 342);

    // Digital Clock Box
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(84, 382, 620, 146);
    ctx.strokeStyle = '#30363D';
    ctx.strokeRect(84, 382, 620, 146);

    ctx.fillStyle = '#8B949E';
    ctx.font = '600 14px "JetBrains Mono", monospace';
    ctx.fillText(`ELAPSED DROUGHT  ·  ${shortDrought.toUpperCase()}`, 108, 416);

    ctx.fillStyle = '#F0F6FC';
    ctx.font = '700 42px "JetBrains Mono", monospace';
    const clockStr = `${duration.days.toLocaleString('en-US')}d : ${pad2(duration.hours)}h : ${pad2(duration.minutes)}m : `;
    ctx.fillText(clockStr, 108, 482);
    const clockWidth = ctx.measureText(clockStr).width;
    ctx.fillStyle = '#00F0FF';
    ctx.fillText(`${pad2(duration.seconds)}s`, 108 + clockWidth, 482);

    // Right Era Panel
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(740, 240, 376, 288);
    ctx.strokeStyle = era.accentHex;
    ctx.lineWidth = 2;
    ctx.strokeRect(740, 240, 376, 288);

    ctx.fillStyle = era.textHex;
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.fillText('ACTIVE GTA ERA', 768, 282);

    ctx.fillStyle = '#F0F6FC';
    ctx.font = '700 28px "Space Grotesk", sans-serif';
    ctx.fillText(era.eraBadge.toUpperCase(), 768, 326);

    ctx.fillStyle = '#B9CACB';
    ctx.font = '500 16px "JetBrains Mono", monospace';
    ctx.fillText(era.releaseDisplay, 768, 362);
    ctx.fillStyle = '#8B949E';
    ctx.fillText(era.platforms, 768, 390);

    ctx.fillStyle = '#FF2A85';
    ctx.font = '700 18px "JetBrains Mono", monospace';
    ctx.fillText(
      subsequentGtaReleases.length === 0
        ? '0 RELEASES SINCE (GTA VI ERA)'
        : `${subsequentGtaReleases.length} MAINLINE GTA ${
            subsequentGtaReleases.length === 1 ? 'RELEASE' : 'RELEASES'
          } SINCE`,
      768,
      462
    );

    ctx.fillStyle = '#8B949E';
    ctx.font = '400 15px "Inter", sans-serif';
    ctx.fillText(
      subsequentGtaReleases.length === 0
        ? 'Current Era (Nov 19, 2026+)'
        : subsequentGtaReleases.map((e) => e.shortLabel).join(', '),
      768,
      494
    );

    // Footer
    ctx.fillStyle = '#484F58';
    ctx.font = '500 14px "JetBrains Mono", monospace';
    ctx.fillText('Data via nflverse · Updated through Super Bowl LX', 84, 566);

    const link = document.createElement('a');
    link.download = `droughts-${team.abbr.toLowerCase()}-${activeMilestone}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded border border-[#30363D] bg-[#161B22] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#30363D] px-5 py-4 bg-[#0D1117]">
          <div>
            <h2
              id="share-modal-title"
              className="font-display text-base font-bold text-[#F0F6FC]"
            >
              Share Misery Card
            </h2>
            <p className="text-xs text-[#8B949E]">
              Export or link directly to {team.name} ({milestoneMeta.label})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded border border-[#30363D] text-[#8B949E] hover:border-[#00F0FF] hover:text-[#F0F6FC] transition-colors cursor-pointer"
            aria-label="Close share modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Visual Card Preview */}
        <div className="p-5 space-y-4">
          <div className="relative overflow-hidden rounded border border-[#30363D] bg-[#0D1117] p-5">
            <div
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{
                background: `linear-gradient(90deg, ${team.primaryColor}, ${era.accentHex})`,
              }}
            />

            <div className="flex items-center justify-between text-[11px] font-mono text-[#8B949E]">
              <span>DROUGHTS IN VICE &amp; LIBERTY</span>
              <span className="text-[#FF2A85] font-bold">RANK #{pad2(rank)} OF 32</span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded border border-white/15 font-display text-base font-bold text-white shrink-0"
                  style={{ backgroundColor: team.primaryColor }}
                >
                  {team.abbr}
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-[#F0F6FC] leading-tight">
                    {team.name}
                  </p>
                  <p className="font-mono text-xs text-[#00F0FF] mt-0.5">
                    {milestoneMeta.uppercaseLabel} ·{' '}
                    {isNever ? 'NEVER' : formatLongDate(record.date!)}
                  </p>
                </div>
              </div>

              <div
                className="rounded-[2px] border px-3 py-1.5 font-mono text-xs font-bold uppercase text-right shrink-0"
                style={{
                  borderColor: era.accentHex,
                  backgroundColor: era.bgTint,
                  color: era.textHex,
                }}
              >
                {era.eraBadge}
              </div>
            </div>

            <div className="mt-4 rounded border border-[#30363D] bg-[#161B22] px-4 py-3 flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-mono text-xl sm:text-2xl font-bold tabular-nums text-[#F0F6FC]">
                {duration.days.toLocaleString('en-US')} DAYS : {pad2(duration.hours)} HRS :{' '}
                {pad2(duration.minutes)} MIN :{' '}
                <span className="text-[#00F0FF]">{pad2(duration.seconds)} SEC</span>
              </span>
              <span className="font-mono text-xs text-[#8B949E]">{shortDrought}</span>
            </div>
          </div>

          {/* Shareable Link Field */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              aria-label="Direct share URL"
              className="flex-1 rounded border border-[#30363D] bg-[#0D1117] px-3 py-2 font-mono text-xs text-[#8B949E] select-all"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex h-9 items-center gap-1.5 rounded bg-[#00F0FF] px-3.5 font-mono text-xs font-bold uppercase text-[#0D1117] hover:bg-[#FF2A85] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Secondary Export Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-[#30363D]">
            <button
              type="button"
              onClick={handleCopyText}
              className="flex h-9 items-center gap-2 rounded border border-[#30363D] bg-transparent px-3.5 font-mono text-xs font-semibold text-[#F0F6FC] hover:border-[#00F0FF] hover:text-[#00F0FF] transition-colors cursor-pointer"
            >
              {copiedText ? <Check className="h-3.5 w-3.5 text-[#00F0FF]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedText ? 'Summary Copied' : 'Copy Text for X / Reddit'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPng}
              className="flex h-9 items-center gap-2 rounded border border-[#00F0FF]/50 bg-[#00F0FF]/10 px-4 font-mono text-xs font-bold uppercase tracking-wider text-[#00F0FF] hover:bg-[#00F0FF] hover:text-[#0D1117] transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PNG (1200×630)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
