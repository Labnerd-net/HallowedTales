import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Mechanical style/guardrail checks on every content file's raw text
// (frontmatter + body) - the "no em dash" style rule and the "stories stand
// alone" no-self-reference rule from CLAUDE.md. Tone, pacing, and spelling
// stay a judgment pass (.claude/skills/proofread) - this only catches the
// two rules that are safe to regex-match without flattening nuance.

const CONTENT_ROOT = join(import.meta.dirname, '..', 'src', 'content');

function findContentFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...findContentFiles(path));
    else if (/\.(md|mdx)$/.test(entry.name)) files.push(path);
  }
  return files;
}

const EM_DASH = '—';

const SELF_REFERENCE_PATTERNS = [
  /this site/i,
  /this page/i,
  /this (entry|pillar|collection)/i,
  /on this (site|page)/i,
  /our (site|collection)/i,
  /hallowedtales/i,
];

const contentFiles = findContentFiles(CONTENT_ROOT);

describe('content style rules', () => {
  it('found content files to check', () => {
    expect(contentFiles.length).toBeGreaterThan(0);
  });

  it.each(contentFiles)('%s has no em dash', (file) => {
    const text = readFileSync(file, 'utf-8');
    expect(text.includes(EM_DASH)).toBe(false);
  });

  it.each(contentFiles)('%s has no self-reference', (file) => {
    const text = readFileSync(file, 'utf-8');
    for (const pattern of SELF_REFERENCE_PATTERNS) {
      expect(text, `matched ${pattern} in ${file}`).not.toMatch(pattern);
    }
  });
});
