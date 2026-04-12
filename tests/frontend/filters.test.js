import { describe, it, expect } from 'vitest';
import { filterTalks } from '../../script-utils.js';

describe('filterTalks', () => {
  describe('by year', () => {
    it('should include only talks matching the year', () => {
      const talks = [
        { year: '2024', name_es: 'Talk 2024' },
        { year: '2023', name_es: 'Talk 2023' },
        { year: '2024', name_es: 'Another 2024' }
      ];

      const filtered = filterTalks(talks, { year: '2024', lang: 'es' });

      expect(filtered).toHaveLength(2);
      expect(filtered.every(t => t.year === '2024')).toBe(true);
    });

    it('should include all talks when year is empty', () => {
      const talks = [
        { year: '2024', name_es: 'Talk 2024' },
        { year: '2023', name_es: 'Talk 2023' }
      ];

      const filtered = filterTalks(talks, { year: '', lang: 'es' });

      expect(filtered).toHaveLength(2);
    });
  });

  describe('by language', () => {
    it('should include only talks matching the language', () => {
      const talks = [
        { talk_language: 'Spanish', name_es: 'Charla' },
        { talk_language: 'English', name_en: 'Talk' },
        { talk_language: 'Spanish', name_es: 'Otra' }
      ];

      const filtered = filterTalks(talks, { language: 'Spanish', lang: 'es' });

      expect(filtered).toHaveLength(2);
      expect(filtered.every(t => t.talk_language === 'Spanish')).toBe(true);
    });

    it('should include all talks when language is empty', () => {
      const talks = [
        { talk_language: 'Spanish', name_es: 'Charla' },
        { talk_language: 'English', name_en: 'Talk' }
      ];

      const filtered = filterTalks(talks, { language: '', lang: 'es' });

      expect(filtered).toHaveLength(2);
    });
  });

  describe('by type', () => {
    it('should include only talks matching the type', () => {
      const talks = [
        { type: 'talk', name_es: 'Talk 1' },
        { type: 'workshop', name_es: 'Workshop 1' },
        { type: 'talk', name_es: 'Talk 2' }
      ];

      const filtered = filterTalks(talks, { type: 'talk', lang: 'es' });

      expect(filtered).toHaveLength(2);
      expect(filtered.every(t => t.type === 'talk')).toBe(true);
    });

    it('should include all talks when type is empty', () => {
      const talks = [
        { type: 'talk', name_es: 'Talk' },
        { type: 'workshop', name_es: 'Workshop' }
      ];

      const filtered = filterTalks(talks, { type: '', lang: 'es' });

      expect(filtered).toHaveLength(2);
    });
  });

  describe('by core', () => {
    it('should only include core talks when filter is enabled', () => {
      const talks = [
        { name_es: 'Core Talk', core: true },
        { name_es: 'Regular Talk', core: false },
        { name_es: 'Another Core', core: true },
        { name_es: 'No core field' }
      ];

      const filtered = filterTalks(talks, { core: true, lang: 'es' });

      expect(filtered).toHaveLength(2);
      expect(filtered.every(t => t.core === true)).toBe(true);
    });

    it('should include all talks when core filter is disabled', () => {
      const talks = [
        { name_es: 'Core Talk', core: true },
        { name_es: 'Regular Talk', core: false }
      ];

      const filtered = filterTalks(talks, { core: false, lang: 'es' });

      expect(filtered).toHaveLength(2);
    });
  });

  describe('by search', () => {
    it('should find talk by name', () => {
      const talks = [
        { name_es: 'TDD en la practica', place: 'Madrid' },
        { name_es: 'Clean Code', place: 'Barcelona' }
      ];

      const filtered = filterTalks(talks, { search: 'tdd', lang: 'es' });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name_es).toBe('TDD en la practica');
    });

    it('should find talk by place', () => {
      const talks = [
        { name_es: 'Talk 1', place: 'BarcelonaSoftwareCrafters' },
        { name_es: 'Talk 2', place: 'Madrid' }
      ];

      const filtered = filterTalks(talks, { search: 'barcelona', lang: 'es' });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].place).toBe('BarcelonaSoftwareCrafters');
    });

    it('should be case insensitive', () => {
      const talks = [
        { name_es: 'Clean Code Workshop', place: 'Madrid' },
        { name_es: 'TDD', place: 'Barcelona' }
      ];

      const filtered = filterTalks(talks, { search: 'clean', lang: 'es' });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name_es).toBe('Clean Code Workshop');
    });

    it('should return no results when search does not match', () => {
      const talks = [
        { name_es: 'TDD', place: 'Madrid' },
        { name_es: 'Clean Code', place: 'Barcelona' }
      ];

      const filtered = filterTalks(talks, { search: 'nonexistent', lang: 'es' });

      expect(filtered).toHaveLength(0);
    });

    it('should return all talks when search is empty', () => {
      const talks = [
        { name_es: 'TDD', place: 'Madrid' },
        { name_es: 'Clean Code', place: 'Barcelona' }
      ];

      const filtered = filterTalks(talks, { search: '', lang: 'es' });

      expect(filtered).toHaveLength(2);
    });

    it('should search using the specified language', () => {
      const talks = [
        { name_es: 'Charla sobre pruebas', name_en: 'Talk about testing', place: 'Madrid' },
        { name_es: 'Modelos de pensamiento', name_en: 'Mental models', place: 'Barcelona' }
      ];

      const filtered = filterTalks(talks, { search: 'testing', lang: 'en' });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name_en).toBe('Talk about testing');
    });

    it('should find talk by key_learning', () => {
      const talks = [
        { name_es: 'Talk A', key_learning_es: 'feedback loops rapidos', place: 'Madrid' },
        { name_es: 'Talk B', key_learning_es: 'patrones de diseno', place: 'Barcelona' }
      ];

      const filtered = filterTalks(talks, { search: 'feedback', lang: 'es' });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name_es).toBe('Talk A');
    });

    it('should find talk by description', () => {
      const talks = [
        { name_es: 'Talk A', description_es: 'sobre testing automatizado', place: 'Madrid' },
        { name_es: 'Talk B', description_es: 'sobre arquitectura', place: 'Barcelona' }
      ];

      const filtered = filterTalks(talks, { search: 'testing', lang: 'es' });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name_es).toBe('Talk A');
    });

    it('should handle talks with missing fields gracefully', () => {
      const talks = [
        { name_es: 'Talk with all fields', description_es: 'desc', place: 'Madrid' },
        { place: 'Barcelona' }
      ];

      const filtered = filterTalks(talks, { search: 'madrid', lang: 'es' });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].place).toBe('Madrid');
    });
  });

  describe('combined filters', () => {
    it('should apply year and type filters together', () => {
      const talks = [
        { year: '2024', type: 'talk', name_es: '2024 Talk' },
        { year: '2024', type: 'workshop', name_es: '2024 Workshop' },
        { year: '2023', type: 'talk', name_es: '2023 Talk' },
        { year: '2024', type: 'talk', name_es: 'Another 2024 Talk' }
      ];

      const filtered = filterTalks(talks, { year: '2024', type: 'talk', lang: 'es' });

      expect(filtered).toHaveLength(2);
      expect(filtered[0].year).toBe('2024');
      expect(filtered[0].type).toBe('talk');
    });

    it('should apply core filter with search', () => {
      const talks = [
        { name_es: 'TDD Workshop', core: true, place: 'Madrid' },
        { name_es: 'TDD Talk', core: false, place: 'Barcelona' },
        { name_es: 'Clean Code', core: true, place: 'Madrid' }
      ];

      const filtered = filterTalks(talks, { core: true, search: 'tdd', lang: 'es' });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name_es).toBe('TDD Workshop');
    });

    it('should apply all filters together', () => {
      const talks = [
        {
          year: '2024',
          type: 'talk',
          talk_language: 'Spanish',
          core: true,
          name_es: 'TDD en practica',
          place: 'Madrid'
        },
        {
          year: '2024',
          type: 'workshop',
          talk_language: 'Spanish',
          core: true,
          name_es: 'TDD Workshop',
          place: 'Barcelona'
        },
        {
          year: '2024',
          type: 'talk',
          talk_language: 'Spanish',
          core: false,
          name_es: 'TDD Basico',
          place: 'Madrid'
        },
        {
          year: '2023',
          type: 'talk',
          talk_language: 'Spanish',
          core: true,
          name_es: 'TDD Avanzado',
          place: 'Madrid'
        }
      ];

      const filtered = filterTalks(talks, {
        year: '2024',
        type: 'talk',
        language: 'Spanish',
        core: true,
        search: 'tdd',
        lang: 'es'
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name_es).toBe('TDD en practica');
    });
  });
});
