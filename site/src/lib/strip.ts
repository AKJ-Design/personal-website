/**
 * The live strip's data contract — build plan §2.3, step 7.
 *
 * The values are PUSHED here, never pulled. An hourly launchd job on the MacBook
 * (home-lab/scripts/strip-snapshot.sh) writes a JSON snapshot into Workers KV; this
 * module reads it and decides what the page is allowed to say. Cloudflare therefore
 * holds a snapshot it was given and has no route into the tailnet, which is the
 * perimeter rule the whole design exists to keep.
 *
 * The snapshot carries RENDERED STRINGS, not numbers. That is deliberate: the
 * coarsening (workout as a category and a day, services as a count, weather at city
 * resolution) happens in the only process that ever sees the fine-grained data. This
 * module cannot render something more precise than it was handed, because it never
 * receives it.
 *
 * Degrade rule, from design/directions.md — never an empty row, never an error:
 *
 *   fresh  (< 24 h)          → the snapshot's values, stamped with its own time
 *   stale  (>= 24 h)         → the same values, stamped with how old they are
 *   absent / malformed / v≠1 → EM DASHES, stamped "snapshot unavailable"
 */

export interface Cell {
  label: string;
  value: string;
}

export interface Snapshot {
  v: number;
  cached_at: string;
  cells: Record<string, Cell>;
}

/** Fixed left-to-right order. The snapshot does not get to reorder the page. */
const CELL_ORDER = ['workout', 'services', 'backup', 'weather'] as const;

const LABELS: Record<(typeof CELL_ORDER)[number], string> = {
  workout: 'Last workout',
  services: 'Services',
  backup: 'Off-site backup',
  weather: 'Weather',
};

/**
 * The no-data row.
 *
 * Build plan §2.3 says to fall back to "the build-time values from the mock" — the
 * mock's `Sleep 7 h 42 m`, `Services 11 / 11 up`. That is not done here, and the
 * departure is on purpose: those numbers would be CLAIMS, rendered at exactly the
 * moment the site has no idea whether they are true. decisions.md's rule for the
 * About plate is the stronger one — "every value is a claim; every one must be
 * literally true" — and a strip that invents a service count while its own data
 * pipeline is down is the precise failure the accuracy gates at step 0 existed for.
 *
 * An em dash still fills the row, so the layout never collapses and the labels still
 * tell you what the site normally knows. It just declines to make something up.
 */
const NO_DATA = '—';

export interface StripView {
  cells: Cell[];
  stamp: string;
  /** Drives the dot: it only pulses when the values are actually current. */
  state: 'fresh' | 'stale' | 'absent';
}

const STALE_AFTER_MS = 24 * 60 * 60 * 1000;

/** Brisbane, always — the site's timezone is a fact about Alex, not about the reader. */
const TIME = new Intl.DateTimeFormat('en-AU', {
  timeZone: 'Australia/Brisbane',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});
const DAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Brisbane' }); // YYYY-MM-DD

function absent(): StripView {
  return {
    cells: CELL_ORDER.map((key) => ({ label: LABELS[key], value: NO_DATA })),
    stamp: 'snapshot unavailable',
    state: 'absent',
  };
}

/**
 * Parse one KV value into something the component can render.
 *
 * Everything here is defensive on purpose. This is the only untrusted input the site
 * has, it arrives from a different machine over a different protocol, and the page it
 * feeds is the front door — so a bad snapshot must degrade, never throw. `v` is
 * checked so that changing the snapshot's shape later fails closed instead of
 * rendering half a strip.
 */
export function stripView(raw: string | null | undefined, now: Date = new Date()): StripView {
  if (!raw) return absent();

  let snap: Snapshot;
  try {
    snap = JSON.parse(raw) as Snapshot;
  } catch {
    return absent();
  }

  if (snap?.v !== 1 || !snap.cells || !snap.cached_at) return absent();

  const cachedAt = new Date(snap.cached_at);
  if (Number.isNaN(cachedAt.getTime())) return absent();

  const cells = CELL_ORDER.map((key) => ({
    label: LABELS[key],
    value: snap.cells[key]?.value || NO_DATA,
  }));

  // Every cell missing means the snapshot is structurally fine but carries nothing —
  // treat it as absence rather than printing a row of dashes under a "cached" stamp
  // that implies the data is merely a little old.
  if (cells.every((cell) => cell.value === NO_DATA)) return absent();

  const ageMs = now.getTime() - cachedAt.getTime();

  if (ageMs >= STALE_AFTER_MS) {
    const days = Math.floor(ageMs / STALE_AFTER_MS);
    return {
      cells,
      stamp: `pushed from my laptop · cached ${days} day${days === 1 ? '' : 's'} ago`,
      state: 'stale',
    };
  }

  // A time alone reads as "today". Under the 24 h window the snapshot can also be
  // from yesterday — seen the morning after step 7 shipped, when "cached 15:33" sat
  // over a workout labelled "yesterday" that was by then two days old. The rendered
  // strings freeze at push time, so the stamp has to carry the day when it matters.
  const when = DAY.format(cachedAt) === DAY.format(now) ? '' : 'yesterday ';

  return {
    cells,
    // Reworded from the mock's "live from my own APIs", which stopped being literally
    // true when weather (a public API) joined the row. This says the thing that is
    // true of all four values, and happens to be the more interesting claim anyway:
    // they were pushed here, from a laptop, rather than fetched on demand.
    stamp: `pushed from my laptop · cached ${when}${TIME.format(cachedAt)}`,
    state: 'fresh',
  };
}
