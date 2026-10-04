// Content loader for case files. Runs in Node during content sync, where the repository is on disk.
// It wraps the glob loader, then for each entry keeps the raw source (for the privacy check)
// and rewrites relative links so they work on the site as well as on GitHub.

import { existsSync, readFileSync, statSync } from 'node:fs';
import { posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'astro/loaders';
import type { Loader } from 'astro/loaders';
import { decodeEntities, githubUrlFor, labsPathFromEntry, publishedPaths, routeFor, slugFor } from './caseFiles';

export function caseFileLoader(): Loader {
  const listed = publishedPaths();
  const published = new Set(listed);
  const inner = glob({
    // Default deny: the pattern is the published list itself, so an unlisted file never loads.
    pattern: listed,
    base: '../labs',
    generateId: ({ entry }) => slugFor(entry),
  });

  return {
    name: 'case-files',
    load: async (context) => {
      await inner.load(context);
      const repoDir = fileURLToPath(new URL('../', context.config.root));

      // A relative link goes to the site page when it names a published file, otherwise to GitHub.
      const rewriteHref = (href: string, labsPath: string): string => {
        const raw = decodeEntities(href);
        if (raw.startsWith('#') || raw.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(raw)) return href;
        if (raw.startsWith('/')) throw new Error(`labs/${labsPath}: link "${raw}" is root-relative; use a path relative to the file.`);

        const [, pathPart = '', suffix = ''] = /^([^?#]*)(.*)$/.exec(raw) ?? [];
        const repoPath = posix.normalize(posix.join('labs', posix.dirname(labsPath), decodeURI(pathPart))).replace(/\/$/, '');
        if (repoPath.startsWith('..')) throw new Error(`labs/${labsPath}: link "${raw}" points outside the repository.`);
        const onDisk = posix.join(repoDir, repoPath);
        if (!existsSync(onDisk)) throw new Error(`labs/${labsPath}: link "${raw}" points to a file that does not exist.`);

        const isDir = statSync(onDisk).isDirectory();
        if (repoPath.startsWith('labs/')) {
          const labsTarget = repoPath.slice('labs/'.length);
          const markdown = isDir ? [`${labsTarget}/README.md`, `${labsTarget}/readme.md`].find((p) => published.has(p)) : labsTarget;
          if (markdown && published.has(markdown)) return routeFor(markdown) + suffix;
        }
        return githubUrlFor(repoPath, isDir ? 'tree' : 'blob') + suffix;
      };

      for (const entry of context.store.values()) {
        const labsPath = labsPathFromEntry(entry.filePath);
        const html = entry.rendered?.html;
        if (html === undefined) throw new Error(`labs/${labsPath} was not rendered by the content loader.`);
        context.store.set({
          ...entry,
          data: { ...entry.data, source: readFileSync(posix.join(repoDir, 'labs', labsPath), 'utf8') },
          rendered: {
            ...entry.rendered,
            html: html.replace(/(<a\b[^>]*?\shref=")([^"]*)(")/g, (_, open: string, href: string, close: string) => open + rewriteHref(href, labsPath) + close),
          },
          // A digest of its own, so the store keeps this version instead of the glob loader's.
          digest: `${entry.digest}:case-file`,
        });
      }
    },
  };
}
