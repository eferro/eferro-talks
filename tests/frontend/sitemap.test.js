import { describe, it, expect } from 'vitest';
import { buildSitemap, buildRobots } from '../../scripts/build-sitemap.js';

const talks = [{ slug: '2024-complexity-trap' }, { slug: '2025-mas-alla' }];

const opts = { siteUrl: 'https://eferro.github.io/eferro-talks' };

describe('buildSitemap', () => {
  it('includes the homepage and one URL per talk', () => {
    const xml = buildSitemap(talks, opts);

    expect(xml).toContain('<loc>https://eferro.github.io/eferro-talks/</loc>');
    expect(xml).toContain(
      '<loc>https://eferro.github.io/eferro-talks/talks/2024-complexity-trap/</loc>'
    );
    expect(xml).toContain('<loc>https://eferro.github.io/eferro-talks/talks/2025-mas-alla/</loc>');
  });

  it('produces valid XML with urlset root', () => {
    const xml = buildSitemap(talks, opts);

    expect(xml).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('</urlset>');
  });
});

describe('buildRobots', () => {
  it('points crawlers at the sitemap', () => {
    const txt = buildRobots(opts);

    expect(txt).toContain('User-agent: *');
    expect(txt).toContain('Allow: /');
    expect(txt).toContain('Sitemap: https://eferro.github.io/eferro-talks/sitemap.xml');
  });
});
