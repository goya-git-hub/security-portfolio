// Build-time privacy check for published case files.
// Scans the raw Markdown so code blocks, alt text and link targets are covered too.

export interface PrivacyFinding {
  file: string;
  line: number;
  rule: string;
  match: string;
}

// Documentation ranges (RFC 5737) are the only addresses allowed in print.
const DOC_RANGES = ['192.0.2.', '198.51.100.', '203.0.113.'];
const EMAIL_ALLOWED = ['@users.noreply.github.com', '@example.com'];

const HOME_MAC = /\/Users\/[^\s/\\'"`()<>[\]]+/g;
const HOME_WIN = /\b[A-Za-z]:\\Users\\(?!Public(?![^\s\\'"`()<>[\]]))[^\s\\'"`()<>[\]]+/gi;
// A dotted run of numbers that is not part of a longer dotted run.
const DOTTED = /(?<![\d.])\d+(?:\.\d+)+(?!\d|\.\d)/g;
const MAC_PAIRS = /(?<![0-9A-Fa-f:-])[0-9A-Fa-f]{2}([:-])(?:[0-9A-Fa-f]{2}\1){4}[0-9A-Fa-f]{2}(?![0-9A-Fa-f:-])/g;
const MAC_DOTTED = /(?<![0-9A-Fa-f.])[0-9A-Fa-f]{4}\.[0-9A-Fa-f]{4}\.[0-9A-Fa-f]{4}(?![0-9A-Fa-f.])/g;
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;

function isPublicIPv4(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 4) return false;
  if (!parts.every((p) => p.length <= 3 && Number(p) <= 255)) return false;
  return !DOC_RANGES.some((range) => token.startsWith(range));
}

function isAllowedEmail(address: string): boolean {
  const lower = address.toLowerCase();
  return EMAIL_ALLOWED.some((suffix) => lower.endsWith(suffix));
}

export function scanText(file: string, text: string): PrivacyFinding[] {
  const findings: PrivacyFinding[] = [];
  text.split(/\r?\n/).forEach((content, index) => {
    const line = index + 1;
    const add = (rule: string, match: string) => findings.push({ file, line, rule, match });

    for (const m of content.matchAll(HOME_MAC)) add('home-directory path', m[0]);
    for (const m of content.matchAll(HOME_WIN)) add('home-directory path', m[0]);
    for (const m of content.matchAll(DOTTED)) if (isPublicIPv4(m[0])) add('IPv4 address', m[0]);
    for (const m of content.matchAll(MAC_PAIRS)) add('MAC address', m[0]);
    for (const m of content.matchAll(MAC_DOTTED)) add('MAC address', m[0]);
    for (const m of content.matchAll(EMAIL)) if (!isAllowedEmail(m[0])) add('email address', m[0]);
  });
  return findings;
}

export function formatFindings(findings: PrivacyFinding[]): string {
  return findings.map((f) => `  ${f.file}:${f.line}  ${f.rule}  "${f.match}"`).join('\n');
}

// Throws so the build stops before any page is written.
export function assertPrivate(files: { file: string; text: string }[]): void {
  const findings = files.flatMap(({ file, text }) => scanText(file, text));
  if (findings.length > 0) {
    throw new Error(
      `Privacy check failed: ${findings.length} finding(s) in published case files.\n` +
        `${formatFindings(findings)}\n` +
        'Fix the source in labs/ or remove the file from src/data/published.json.',
    );
  }
}
