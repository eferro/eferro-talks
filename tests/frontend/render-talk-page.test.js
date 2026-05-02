import { describe, it, expect } from 'vitest';
import { renderTalkPageHtml } from '../../scripts/render-talk-page.js';

const sampleTalk = {
  slug: '2024-complexity-trap',
  year: '2024',
  date: '01/01/2024',
  place: 'DevOpsDays Madrid',
  type: 'talk',
  core: true,
  talk_language: 'English',
  name_en: 'The Complexity Trap',
  name_es: 'La trampa de la complejidad',
  description_en: 'A talk about hidden complexity costs.',
  description_es: 'Charla sobre costes ocultos de la complejidad.',
  key_learning_en: 'Optimize for **simplicity**.',
  key_learning_es: 'Optimiza por **simplicidad**.',
  key_points_en: '- Point A\n- Point B',
  key_points_es: '- Punto A\n- Punto B',
  blog: 'https://example.com/blog',
  video: 'https://example.com/video',
  presentation: 'https://example.com/slides'
};

const opts = { siteUrl: 'https://eferro.github.io/eferro-talks' };

describe('renderTalkPageHtml', () => {
  it('renders a full HTML document with the talk name as title in primary language', () => {
    const html = renderTalkPageHtml(sampleTalk, opts);

    expect(html).toMatch(/^<!doctype html>/i);
    expect(html).toContain('<title>The Complexity Trap</title>');
  });

  it('sets html lang to the talks primary language', () => {
    const html = renderTalkPageHtml(sampleTalk, opts);

    expect(html).toMatch(/<html[^>]*\blang="en"/);
  });

  it('emits Open Graph tags for crawlers', () => {
    const html = renderTalkPageHtml(sampleTalk, opts);

    expect(html).toContain('<meta property="og:title" content="The Complexity Trap">');
    expect(html).toContain(
      '<meta property="og:description" content="A talk about hidden complexity costs.">'
    );
    expect(html).toContain('<meta property="og:type" content="article">');
    expect(html).toContain(
      '<meta property="og:url" content="https://eferro.github.io/eferro-talks/talks/2024-complexity-trap/">'
    );
  });

  it('emits a canonical link to the stable per-talk URL', () => {
    const html = renderTalkPageHtml(sampleTalk, opts);

    expect(html).toContain(
      '<link rel="canonical" href="https://eferro.github.io/eferro-talks/talks/2024-complexity-trap/">'
    );
  });

  it('emits twitter card meta', () => {
    const html = renderTalkPageHtml(sampleTalk, opts);

    expect(html).toContain('<meta name="twitter:card" content="summary_large_image">');
  });

  it('pre-renders the talk name as an h1 so crawlers see content without JS', () => {
    const html = renderTalkPageHtml(sampleTalk, opts);

    expect(html).toMatch(/<h1[^>]*>The Complexity Trap<\/h1>/);
  });

  it('escapes HTML in name and description to prevent injection', () => {
    const evilTalk = {
      ...sampleTalk,
      name_en: '<script>alert(1)</script>',
      description_en: '"><img onerror=alert(1)>'
    };

    const html = renderTalkPageHtml(evilTalk, opts);

    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).not.toContain('<img onerror=alert(1)>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('uses Spanish as primary when talk_language is Spanish', () => {
    const esTalk = { ...sampleTalk, talk_language: 'Spanish' };

    const html = renderTalkPageHtml(esTalk, opts);

    expect(html).toContain('<title>La trampa de la complejidad</title>');
    expect(html).toMatch(/<html[^>]*\blang="es"/);
  });

  it('references shared assets with a parents-up relative path so /talks/<slug>/ works', () => {
    const html = renderTalkPageHtml(sampleTalk, opts);

    expect(html).toContain('href="../../style.css"');
    expect(html).toContain('src="../../assets/images/logo-horizontal.png"');
  });

  it('renders key_points markdown as a real list, not raw <pre> text', () => {
    const html = renderTalkPageHtml(sampleTalk, opts);

    expect(html).toContain('<ul>');
    expect(html).toContain('<li>Point A</li>');
    expect(html).toContain('<li>Point B</li>');
    expect(html).not.toContain('<pre>- Point A');
  });

  it('renders key_learning markdown so **bold** becomes <strong>', () => {
    const html = renderTalkPageHtml(sampleTalk, opts);

    expect(html).toContain('<strong>simplicity</strong>');
  });

  it('includes external links when present', () => {
    const html = renderTalkPageHtml(sampleTalk, opts);

    expect(html).toContain('href="https://example.com/blog"');
    expect(html).toContain('href="https://example.com/video"');
    expect(html).toContain('href="https://example.com/slides"');
  });
});
