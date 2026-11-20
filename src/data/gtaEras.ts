export type GtaEraId =
  | 'pre_gta'
  | 'gta_1'
  | 'gta_2'
  | 'gta_3'
  | 'vice_city'
  | 'san_andreas'
  | 'gta_4'
  | 'gta_5'
  | 'gta_6';

export interface GtaEra {
  id: GtaEraId;
  shortLabel: string;
  chipLabel: string;
  fullTitle: string;
  eraBadge: string;
  releaseDate: string | null; // ISO YYYY-MM-DD, null for Pre-GTA
  releaseDisplay: string;
  platforms: string;
  setting: string;
  tagline: string;
  accentHex: string;
  secondaryHex: string;
  bgTint: string;
  borderTint: string;
  textHex: string;
  /** 4-panel Rockstar cover-art mosaic colors */
  coverPanels: [string, string, string, string];
  order: number;
  isMainlineRelease: boolean;
}

export const GTA_ERAS: GtaEra[] = [
  {
    id: 'pre_gta',
    shortLabel: 'Pre-GTA',
    chipLabel: 'Pre-GTA',
    fullTitle: 'PRE-GRAND THEFT AUTO ERA',
    eraBadge: 'Pre-GTA Era',
    releaseDate: null,
    releaseDisplay: 'Before Nov 28, 1997',
    platforms: 'SNES / Sega Genesis / Arcade',
    setting: 'Before Liberty City Existed',
    tagline: 'DMA Design had not yet shipped the original top-down Grand Theft Auto.',
    accentHex: '#FF2A85',
    secondaryHex: '#93000A',
    bgTint: 'rgba(255, 42, 133, 0.12)',
    borderTint: 'rgba(255, 42, 133, 0.45)',
    textHex: '#FF6AA8',
    coverPanels: ['#4A0D25', '#241428', '#7A163F', '#161B22'],
    order: 0,
    isMainlineRelease: false,
  },
  {
    id: 'gta_1',
    shortLabel: 'GTA 1',
    chipLabel: 'GTA 1',
    fullTitle: 'GRAND THEFT AUTO',
    eraBadge: 'GTA 1 Era',
    releaseDate: '1997-11-28',
    releaseDisplay: 'Released November 28, 1997',
    platforms: 'MS-DOS / Windows / PlayStation',
    setting: 'Liberty, San Andreas & Vice (2D)',
    tagline: 'Top-down pixel chases, dial-up modems, and 90s pager alerts.',
    accentHex: '#F97316',
    secondaryHex: '#C2410C',
    bgTint: 'rgba(249, 115, 22, 0.12)',
    borderTint: 'rgba(249, 115, 22, 0.45)',
    textHex: '#FB923C',
    coverPanels: ['#7C2D12', '#431407', '#C2410C', '#1C1917'],
    order: 1,
    isMainlineRelease: true,
  },
  {
    id: 'gta_2',
    shortLabel: 'GTA 2',
    chipLabel: 'GTA 2',
    fullTitle: 'GRAND THEFT AUTO 2',
    eraBadge: 'GTA 2 Era',
    releaseDate: '1999-10-22',
    releaseDisplay: 'Released October 22, 1999',
    platforms: 'PlayStation / Dreamcast / PC',
    setting: 'Anywhere City',
    tagline: 'Y2K panic, Sega Dreamcast launches, and Respect-O-Meter gang wars.',
    accentHex: '#EAB308',
    secondaryHex: '#A16207',
    bgTint: 'rgba(234, 179, 8, 0.12)',
    borderTint: 'rgba(234, 179, 8, 0.45)',
    textHex: '#FACC15',
    coverPanels: ['#713F12', '#292524', '#A16207', '#171717'],
    order: 2,
    isMainlineRelease: true,
  },
  {
    id: 'gta_3',
    shortLabel: 'GTA III',
    chipLabel: 'GTA III',
    fullTitle: 'GRAND THEFT AUTO III',
    eraBadge: 'GTA III Era',
    releaseDate: '2001-10-22',
    releaseDisplay: 'Released October 22, 2001',
    platforms: 'PlayStation 2',
    setting: 'Liberty City (3D Universe)',
    tagline: 'Open-world 3D gaming was born on the PS2 with Claude in Portland.',
    accentHex: '#94A3B8',
    secondaryHex: '#475569',
    bgTint: 'rgba(148, 163, 184, 0.14)',
    borderTint: 'rgba(148, 163, 184, 0.45)',
    textHex: '#CBD5E1',
    coverPanels: ['#334155', '#1E293B', '#475569', '#0F172A'],
    order: 3,
    isMainlineRelease: true,
  },
  {
    id: 'vice_city',
    shortLabel: 'Vice City',
    chipLabel: 'Vice City',
    fullTitle: 'GRAND THEFT AUTO: VICE CITY',
    eraBadge: 'Vice City Era',
    releaseDate: '2002-10-29',
    releaseDisplay: 'Released October 29, 2002',
    platforms: 'PlayStation 2',
    setting: 'Vice City, 1986',
    tagline: 'Tommy Vercetti, pastel suits, Flash FM, and Ocean Beach neon.',
    accentHex: '#EC4899',
    secondaryHex: '#06B6D4',
    bgTint: 'rgba(236, 72, 153, 0.14)',
    borderTint: 'rgba(236, 72, 153, 0.5)',
    textHex: '#F472B6',
    coverPanels: ['#831843', '#155E75', '#BE185D', '#1E1B4B'],
    order: 4,
    isMainlineRelease: true,
  },
  {
    id: 'san_andreas',
    shortLabel: 'San Andreas',
    chipLabel: 'San Andreas',
    fullTitle: 'GRAND THEFT AUTO: SAN ANDREAS',
    eraBadge: 'San Andreas Era',
    releaseDate: '2004-10-26',
    releaseDisplay: 'Released October 26, 2004',
    platforms: 'PlayStation 2',
    setting: 'Los Santos, San Fierro & Las Venturas',
    tagline: 'Grove Street, Home — CJ was still following the damn train.',
    accentHex: '#F59E0B',
    secondaryHex: '#15803D',
    bgTint: 'rgba(245, 158, 11, 0.12)',
    borderTint: 'rgba(245, 158, 11, 0.45)',
    textHex: '#FBBF24',
    coverPanels: ['#78350F', '#14532D', '#B45309', '#1F2937'],
    order: 5,
    isMainlineRelease: true,
  },
  {
    id: 'gta_4',
    shortLabel: 'GTA IV',
    chipLabel: 'GTA IV',
    fullTitle: 'GRAND THEFT AUTO IV',
    eraBadge: 'GTA IV Era',
    releaseDate: '2008-04-29',
    releaseDisplay: 'Released April 29, 2008',
    platforms: 'PS3 / Xbox 360',
    setting: 'Liberty City (HD Universe)',
    tagline: 'Niko Bellic arrived by cargo ship and Roman kept calling to go bowling.',
    accentHex: '#A3E635',
    secondaryHex: '#4D7C0F',
    bgTint: 'rgba(163, 230, 53, 0.11)',
    borderTint: 'rgba(163, 230, 53, 0.4)',
    textHex: '#BEF264',
    coverPanels: ['#365314', '#1F2937', '#4D7C0F', '#111827'],
    order: 6,
    isMainlineRelease: true,
  },
  {
    id: 'gta_5',
    shortLabel: 'GTA V',
    chipLabel: 'GTA V',
    fullTitle: 'GRAND THEFT AUTO V',
    eraBadge: 'GTA V Era',
    releaseDate: '2013-09-17',
    releaseDisplay: 'Released September 17, 2013',
    platforms: 'PS3 / Xbox 360 / PS4 / PS5',
    setting: 'Los Santos & Blaine County',
    tagline: 'Spanned three console generations while franchises waited for January.',
    accentHex: '#38BDF8',
    secondaryHex: '#0284C7',
    bgTint: 'rgba(56, 189, 248, 0.11)',
    borderTint: 'rgba(56, 189, 248, 0.4)',
    textHex: '#7DD3FC',
    coverPanels: ['#0C4A6E', '#14532D', '#0369A1', '#1E293B'],
    order: 7,
    isMainlineRelease: true,
  },
  {
    id: 'gta_6',
    shortLabel: 'GTA VI',
    chipLabel: 'GTA VI / Active',
    fullTitle: 'GRAND THEFT AUTO VI',
    eraBadge: 'GTA VI / Active',
    releaseDate: '2026-11-19',
    releaseDisplay: '2026 Release Cycle • Active Field',
    platforms: 'PS5 / Xbox Series X|S',
    setting: 'Vice City & State of Leonida',
    tagline: 'Current postseason cycle — fresh off the 2025–26 NFL playoff bracket.',
    accentHex: '#00F0FF',
    secondaryHex: '#FF2A85',
    bgTint: 'rgba(0, 240, 255, 0.11)',
    borderTint: 'rgba(0, 240, 255, 0.45)',
    textHex: '#00F0FF',
    coverPanels: ['#164E63', '#831843', '#0E7490', '#3B0764'],
    order: 8,
    isMainlineRelease: true,
  },
];

export const GTA_ERA_MAP: Record<GtaEraId, GtaEra> = GTA_ERAS.reduce(
  (acc, era) => {
    acc[era.id] = era;
    return acc;
  },
  {} as Record<GtaEraId, GtaEra>
);

/**
 * Classifies an NFL milestone date (YYYY-MM-DD) into its corresponding GTA era.
 * Dates from the current 2025–26 postseason (Jan–Feb 2026 onward) map to the active GTA VI cycle.
 * Null dates (franchises that have never reached the milestone) map to Pre-GTA.
 */
export function resolveGtaEra(isoDate: string | null): GtaEra {
  if (!isoDate) return GTA_ERA_MAP.pre_gta;

  // 2025–26 NFL postseason (Jan 2026+) belongs to the active GTA VI cycle
  if (isoDate >= '2026-01-01') return GTA_ERA_MAP.gta_6;
  if (isoDate >= '2013-09-17') return GTA_ERA_MAP.gta_5;
  if (isoDate >= '2008-04-29') return GTA_ERA_MAP.gta_4;
  if (isoDate >= '2004-10-26') return GTA_ERA_MAP.san_andreas;
  if (isoDate >= '2002-10-29') return GTA_ERA_MAP.vice_city;
  if (isoDate >= '2001-10-22') return GTA_ERA_MAP.gta_3;
  if (isoDate >= '1999-10-22') return GTA_ERA_MAP.gta_2;
  if (isoDate >= '1997-11-28') return GTA_ERA_MAP.gta_1;
  return GTA_ERA_MAP.pre_gta;
}

/**
 * Returns the list of mainline GTA releases launched strictly AFTER the given era.
 */
export function getSubsequentGtaReleases(eraId: GtaEraId): GtaEra[] {
  const current = GTA_ERA_MAP[eraId];
  return GTA_ERAS.filter((e) => e.isMainlineRelease && e.order > current.order);
}
