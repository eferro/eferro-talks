import { describe, it, expect } from 'vitest';
import { buildTalkFiles } from '../../scripts/build-talks-core.js';

const talks = [
  {
    slug: '2024-complexity-trap',
    year: '2024',
    talk_language: 'English',
    name_en: 'The Complexity Trap',
    description_en: 'desc'
  },
  {
    slug: '2025-mas-alla',
    year: '2025',
    talk_language: 'Spanish',
    name_es: 'Más allá',
    description_es: 'desc es'
  }
];

const opts = { siteUrl: 'https://eferro.github.io/eferro-talks' };

describe('buildTalkFiles', () => {
  it('produces one HTML file per talk under talks/<slug>/index.html', () => {
    const files = buildTalkFiles(talks, opts);

    const paths = files.map(f => f.path).sort();
    expect(paths).toEqual([
      'talks/2024-complexity-trap/index.html',
      'talks/2025-mas-alla/index.html'
    ]);
  });

  it('embeds the talk title in each generated file', () => {
    const files = buildTalkFiles(talks, opts);

    const trap = files.find(f => f.path.includes('2024-complexity-trap'));
    expect(trap.content).toContain('<title>The Complexity Trap</title>');

    const masAlla = files.find(f => f.path.includes('2025-mas-alla'));
    expect(masAlla.content).toContain('<title>Más allá</title>');
  });

  it('throws when a talk is missing its slug', () => {
    const broken = [{ year: '2020', name_en: 'No slug' }];

    expect(() => buildTalkFiles(broken, opts)).toThrow(/slug/);
  });

  it('throws when two talks share the same slug', () => {
    const dupes = [
      { slug: 'dup', name_en: 'A' },
      { slug: 'dup', name_en: 'B' }
    ];

    expect(() => buildTalkFiles(dupes, opts)).toThrow(/duplicate/i);
  });
});
