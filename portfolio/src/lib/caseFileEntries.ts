import { getCollection, type CollectionEntry } from 'astro:content';
import { headFor, labsPathFromEntry, phaseFor, publishedPaths, routeFor, slugFor, sourceUrlFor } from './caseFiles';
import { assertPrivate } from './privacy';

export interface CaseFile {
  entry: CollectionEntry<'caseFiles'>;
  path: string;
  slug: string;
  href: string;
  sourceUrl: string;
  phase?: number;
  source: string;
  title: string;
  summary?: string;
  summaryHtml?: string;
}

// Every published case file, checked both ways against the list.
export async function getCaseFiles(): Promise<CaseFile[]> {
  const listed = publishedPaths();
  const entries = await getCollection('caseFiles');
  const found = new Set<string>();

  const files = entries.map((entry) => {
    const path = labsPathFromEntry(entry.filePath);
    if (!listed.includes(path)) throw new Error(`labs/${path} is in the collection but not in src/data/published.json.`);
    found.add(path);
    const html = entry.rendered?.html;
    const source = (entry.data as { source?: unknown }).source;
    if (html === undefined || typeof source !== 'string') throw new Error(`labs/${path} was not loaded by the case file loader.`);
    return {
      entry,
      path,
      slug: slugFor(path),
      href: routeFor(path),
      sourceUrl: sourceUrlFor(path),
      phase: phaseFor(path),
      source,
      ...headFor(html, path),
    };
  });

  const missing = listed.filter((path) => !found.has(path));
  if (missing.length > 0) throw new Error(`Listed in src/data/published.json but not found in labs/: ${missing.join(', ')}`);

  // By slug, so a folder's README comes before the files inside it.
  return files.sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));
}

// Fails the build, naming file, line and match, if a published file holds private details.
export function checkPrivacy(files: CaseFile[]): void {
  assertPrivate(files.map((file) => ({ file: `labs/${file.path}`, text: file.source })));
}
