// Case files: lab write-ups in ../labs, published only when listed in src/data/published.json.
// Pages are prerendered inside workerd, so nothing here touches the filesystem;
// that work happens in the content loader (see caseFileLoader.ts).

import published from '../data/published.json';

export const REPO_URL = 'https://github.com/goya-git-hub/security-portfolio';

// Plain relative paths only: a glob character here would publish more than one file.
const SAFE_PATH = /^[A-Za-z0-9_-][A-Za-z0-9._ -]*(?:\/[A-Za-z0-9_-][A-Za-z0-9._ -]*)*\.md$/;

export function publishedPaths(): string[] {
  if (!Array.isArray(published)) throw new Error('src/data/published.json must be an array of paths.');
  for (const path of published) {
    if (typeof path !== 'string' || !SAFE_PATH.test(path) || path.split('/').includes('..')) {
      throw new Error(`src/data/published.json: "${path}" is not a plain path to a .md file inside labs/.`);
    }
  }
  return [...published];
}

// labs/00-environment/README.md -> 00-environment; labs/00-environment/branch-protection.md -> 00-environment/branch-protection
export function slugFor(labsPath: string): string {
  const parts = labsPath.replace(/\.md$/i, '').split('/');
  if (/^readme$/i.test(parts[parts.length - 1])) parts.pop();
  const slug = parts.join('/').toLowerCase();
  if (!slug) throw new Error(`labs/${labsPath} would publish at /labs/, which is the index page.`);
  return slug;
}

export const routeFor = (labsPath: string) => `/labs/${slugFor(labsPath)}/`;
export const githubUrlFor = (repoPath: string, kind: 'blob' | 'tree' = 'blob') => `${REPO_URL}/${kind}/main/${encodeURI(repoPath)}`;
export const sourceUrlFor = (labsPath: string) => githubUrlFor(`labs/${labsPath}`);

export function phaseFor(labsPath: string): number | undefined {
  const match = /^(\d+)-/.exec(labsPath);
  return match ? Number(match[1]) : undefined;
}

// Entry file paths are relative to the project root, e.g. "../labs/00-environment/README.md".
export function labsPathFromEntry(filePath: string | undefined): string {
  const prefix = '../labs/';
  if (!filePath?.startsWith(prefix)) throw new Error(`Case file "${filePath}" is not inside labs/.`);
  return filePath.slice(prefix.length);
}

// --- HTML helpers. The input is Markdown rendered by Astro, so it is well formed. ---

const VOID = new Set(['area', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

interface Block {
  tag: string;
  start: number;
  end: number;
}

function topLevelBlocks(html: string): Block[] {
  const blocks: Block[] = [];
  const tagPattern = /<!--[\s\S]*?-->|<(\/?)([A-Za-z][A-Za-z0-9-]*)\b[^>]*?(\/?)>/g;
  let depth = 0;
  let open: { tag: string; start: number } | undefined;
  for (const m of html.matchAll(tagPattern)) {
    if (!m[2]) continue;
    const tag = m[2].toLowerCase();
    const start = m.index ?? 0;
    const end = start + m[0].length;
    if (m[1] === '/') {
      depth -= 1;
      if (depth === 0 && open) {
        blocks.push({ tag: open.tag, start: open.start, end });
        open = undefined;
      }
    } else if (m[3] === '/' || VOID.has(tag)) {
      if (depth === 0) blocks.push({ tag, start, end });
    } else {
      if (depth === 0) open = { tag, start };
      depth += 1;
    }
  }
  return blocks;
}

// The title is the first top-level h1. The summary is the paragraph straight after it, if there is one.
function headBlocks(html: string): { title?: Block; summary?: Block } {
  const blocks = topLevelBlocks(html);
  const index = blocks.findIndex((b) => b.tag === 'h1');
  if (index === -1) return {};
  const next = blocks[index + 1];
  return { title: blocks[index], summary: next?.tag === 'p' ? next : undefined };
}

const innerHtml = (html: string, block: Block) =>
  html.slice(block.start, block.end).replace(/^<[^>]+>/, '').replace(/<\/[^>]+>$/, '');

export function decodeEntities(text: string): string {
  const named: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code[0] === '#') {
      const value = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(value) ? String.fromCodePoint(value) : whole;
    }
    return named[code.toLowerCase()] ?? whole;
  });
}

// Plain text; keeps the source's line breaks so a multi-line summary still reads line by line.
const toText = (html: string) =>
  decodeEntities(html.replace(/<[^>]+>/g, ''))
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');

// Title and summary, from Markdown the loader has already rendered (links already rewritten).
export function headFor(html: string, labsPath: string) {
  const { title, summary } = headBlocks(html);
  if (!title) throw new Error(`labs/${labsPath} has no "# " heading, so it has no title. Add one before publishing it.`);
  const summaryHtml = summary ? innerHtml(html, summary).trim() : undefined;
  return {
    title: toText(innerHtml(html, title)),
    summaryHtml,
    summary: summaryHtml ? toText(summaryHtml) : undefined,
  };
}

// The page body: the Markdown without the title and summary (they are in the page header),
// without inline styles, and with tables wrapped so they scroll sideways in their own box.
export function bodyFor(html: string): string {
  const { title, summary } = headBlocks(html);
  let body = html;
  // Cut the later block first so the earlier block's offsets stay valid.
  for (const block of [summary, title].filter((b): b is Block => Boolean(b))) {
    body = body.slice(0, block.start) + body.slice(block.end);
  }
  let tables = 0;
  return body
    // Table column alignment arrives as an inline style; keep it as a class.
    .replace(/\sstyle="text-align:\s*(left|center|right);?"/g, ' class="align-$1"')
    .replace(/\sstyle="[^"]*"/g, '')
    .replace(/<table>/g, (_, offset: number, all: string) => {
      // Name the scroll box after the nearest heading above it.
      const heading = [...all.slice(0, offset).matchAll(/<h[2-6] id="([^"]+)"/g)].pop();
      const name = heading ? `aria-labelledby="${heading[1]}"` : `aria-label="Table ${++tables}"`;
      return `<div class="table-scroll" role="region" tabindex="0" ${name}><table>`;
    })
    .replace(/<\/table>/g, '</table></div>')
    .trim();
}
