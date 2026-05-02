function trimUrl(url) {
  return (url || '').replace(/\/$/, '');
}

export function buildSitemap(talks, opts = {}) {
  const base = trimUrl(opts.siteUrl);
  const urls = [`${base}/`, ...talks.map(t => `${base}/talks/${t.slug}/`)];
  const entries = urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

export function buildRobots(opts = {}) {
  const base = trimUrl(opts.siteUrl);
  return `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`;
}
