import { describe, it, expect } from 'vitest';
import { countByType, sortByYearDescending } from '../../script-utils.js';

describe('countByType', () => {
  it('should count talks by type', () => {
    const talks = [
      { type: 'talk' },
      { type: 'workshop' },
      { type: 'talk' },
      { type: 'podcast' },
      { type: 'talk' }
    ];

    const result = countByType(talks);

    expect(result).toEqual({ talk: 3, workshop: 1, podcast: 1 });
  });

  it('should handle talks without type as unknown', () => {
    const talks = [{ type: 'talk' }, { name: 'Talk without type' }, { type: null }];

    const result = countByType(talks);

    expect(result).toEqual({ talk: 1, unknown: 2 });
  });
});

describe('sortByYearDescending', () => {
  it('should sort talks by year descending', () => {
    const talks = [
      { year: '2022', name_es: 'Old Talk' },
      { year: '2024', name_es: 'New Talk' },
      { year: '2023', name_es: 'Middle Talk' }
    ];

    const sorted = sortByYearDescending(talks);

    expect(sorted[0].year).toBe('2024');
    expect(sorted[1].year).toBe('2023');
    expect(sorted[2].year).toBe('2022');
  });

  it('should handle missing year as 0', () => {
    const talks = [
      { year: '2024', name_es: 'New Talk' },
      { name_es: 'Talk without year' },
      { year: null, name_es: 'Talk with null year' }
    ];

    const sorted = sortByYearDescending(talks);

    expect(sorted[0].year).toBe('2024');
  });

  it('should handle invalid year strings as 0', () => {
    const talks = [
      { year: '2024', name_es: 'Valid Year' },
      { year: 'invalid', name_es: 'Invalid Year' }
    ];

    const sorted = sortByYearDescending(talks);

    expect(sorted[0].year).toBe('2024');
    expect(sorted[1].year).toBe('invalid');
  });

  it('should not mutate the original array', () => {
    const talks = [
      { year: '2022', name_es: 'Old' },
      { year: '2024', name_es: 'New' }
    ];

    sortByYearDescending(talks);

    expect(talks[0].year).toBe('2022');
  });
});
