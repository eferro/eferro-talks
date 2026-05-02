#!/usr/bin/env node
import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTalkFiles } from './build-talks-core.js';
import { buildSitemap, buildRobots } from './build-sitemap.js';

const SITE_URL = process.env.SITE_URL || 'https://eferro.github.io/eferro-talks';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const talksJsonPath = join(repoRoot, 'data', 'talks.json');
const outRoot = join(repoRoot, 'talks');

async function main() {
  const raw = await readFile(talksJsonPath, 'utf8');
  const talks = JSON.parse(raw);

  if (existsSync(outRoot)) {
    await rm(outRoot, { recursive: true, force: true });
  }

  const files = buildTalkFiles(talks, { siteUrl: SITE_URL });

  for (const file of files) {
    const fullPath = join(repoRoot, file.path);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, file.content, 'utf8');
  }

  await writeFile(
    join(repoRoot, 'sitemap.xml'),
    buildSitemap(talks, { siteUrl: SITE_URL }),
    'utf8'
  );
  await writeFile(join(repoRoot, 'robots.txt'), buildRobots({ siteUrl: SITE_URL }), 'utf8');

  console.log(`Built ${files.length} talk pages under talks/`);
  console.log('Wrote sitemap.xml and robots.txt');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
