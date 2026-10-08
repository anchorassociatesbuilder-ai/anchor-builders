import { SITE_DATA } from '../src/data';

// Normalises client names to a canonical key for fuzzy matching against the curated roster.

function norm(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents (é -> e)
    .toLowerCase()
    .replace(/['’`]/g, '') // drop apostrophes (Jee's -> jees)
    .replace(/[^a-z0-9]+/g, ' ') // any other punctuation -> space (keeps words)
    .trim();
}

// normalized variant -> canonical token (the normalized curated short name)
const ALIASES = (() => {
  const map = new Map();
  for (const c of SITE_DATA.CLIENTS) {
    const canon = norm(c.name);
    if (!canon) continue;
    map.set(norm(c.name), canon);
    if (c.fullName) map.set(norm(c.fullName), canon);
  }
  // A few common short-form variants that aren't the full name.
  const manual = {
    'fourth wall': 'Fourth Wall Studios',
    'fourth wall studio': 'Fourth Wall Studios',
    'wah nobel group': 'Wah Nobel',
    'allied bank limited': 'Allied Bank',
    'alkaram university': 'Al Karam University',
  };
  for (const [variant, canonName] of Object.entries(manual)) {
    map.set(norm(variant), norm(canonName));
  }
  return map;
})();

export function canonicalClientKey(value) {
  const n = norm(value);
  if (!n) return '';
  return ALIASES.get(n) || n;
}
