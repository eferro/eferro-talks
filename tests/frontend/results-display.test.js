import { describe, it, expect } from 'vitest';

describe('Results Display Logic', () => {
  describe('type counting', () => {
    it('should count talks by type', () => {
      const talks = [
        { type: 'talk' },
        { type: 'workshop' },
        { type: 'talk' },
        { type: 'podcast' },
        { type: 'talk' }
      ];

      const typeCounts = talks.reduce((acc, talk) => {
        const type = talk.type || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      expect(typeCounts).toEqual({
        talk: 3,
        workshop: 1,
        podcast: 1
      });
    });

    it('should handle talks without type as unknown', () => {
      const talks = [{ type: 'talk' }, { name: 'Talk without type' }, { type: null }];

      const typeCounts = talks.reduce((acc, talk) => {
        const type = talk.type || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      expect(typeCounts).toEqual({
        talk: 1,
        unknown: 2
      });
    });

    it('should sort type entries alphabetically', () => {
      const typeCounts = {
        workshop: 2,
        talk: 5,
        podcast: 1,
        panel: 3
      };

      const typeEntries = Object.entries(typeCounts).sort(([a], [b]) => a.localeCompare(b));

      expect(typeEntries).toEqual([
        ['panel', 3],
        ['podcast', 1],
        ['talk', 5],
        ['workshop', 2]
      ]);
    });
  });

  describe('talk sorting', () => {
    it('should sort talks by year descending', () => {
      const talks = [
        { year: '2022', name_es: 'Old Talk' },
        { year: '2024', name_es: 'New Talk' },
        { year: '2023', name_es: 'Middle Talk' }
      ];

      const sorted = [...talks].sort((a, b) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA;
      });

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

      const sorted = [...talks].sort((a, b) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA;
      });

      expect(sorted[0].year).toBe('2024');
      expect(sorted[1].name_es).toMatch(/without year|null year/);
    });

    it('should handle invalid year strings as 0', () => {
      const talks = [
        { year: '2024', name_es: 'Valid Year' },
        { year: 'invalid', name_es: 'Invalid Year' }
      ];

      const sorted = [...talks].sort((a, b) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA;
      });

      expect(sorted[0].year).toBe('2024');
      expect(sorted[1].year).toBe('invalid');
    });
  });
});
