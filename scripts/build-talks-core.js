import { renderTalkPageHtml } from './render-talk-page.js';

export function buildTalkFiles(talks, opts = {}) {
  const seen = new Set();
  return talks.map(talk => {
    if (!talk.slug) {
      throw new Error(`Talk is missing slug: ${JSON.stringify(talk).slice(0, 120)}`);
    }
    if (seen.has(talk.slug)) {
      throw new Error(`Duplicate slug: ${talk.slug}`);
    }
    seen.add(talk.slug);
    return {
      path: `talks/${talk.slug}/index.html`,
      content: renderTalkPageHtml(talk, opts)
    };
  });
}
