import { describe, it, expect } from 'vitest';
import { getTalkField } from '../../script-utils.js';

describe('Talk Filtering Logic', () => {
  describe('filterByYear', () => {
    it('should include talks matching the year filter', () => {
      const talks = [
        { year: '2024', name_es: 'Talk 2024' },
        { year: '2023', name_es: 'Talk 2023' },
        { year: '2024', name_es: 'Another 2024' }
      ];
      const yearFilter = '2024';

      const filtered = talks.filter(talk => {
        if (yearFilter && talk.year !== yearFilter) return false;
        return true;
      });

      expect(filtered).toHaveLength(2);
      expect(filtered[0].year).toBe('2024');
      expect(filtered[1].year).toBe('2024');
    });

    it('should include all talks when year filter is empty', () => {
      const talks = [
        { year: '2024', name_es: 'Talk 2024' },
        { year: '2023', name_es: 'Talk 2023' }
      ];
      const yearFilter = '';

      const filtered = talks.filter(talk => {
        if (yearFilter && talk.year !== yearFilter) return false;
        return true;
      });

      expect(filtered).toHaveLength(2);
    });
  });

  describe('filterByLanguage', () => {
    it('should include talks matching the language filter', () => {
      const talks = [
        { talk_language: 'Spanish', name_es: 'Charla en español' },
        { talk_language: 'English', name_en: 'Talk in English' },
        { talk_language: 'Spanish', name_es: 'Otra charla' }
      ];
      const languageFilter = 'Spanish';

      const filtered = talks.filter(talk => {
        if (languageFilter && talk.talk_language !== languageFilter) return false;
        return true;
      });

      expect(filtered).toHaveLength(2);
      expect(filtered[0].talk_language).toBe('Spanish');
      expect(filtered[1].talk_language).toBe('Spanish');
    });

    it('should include all talks when language filter is empty', () => {
      const talks = [
        { talk_language: 'Spanish', name_es: 'Charla' },
        { talk_language: 'English', name_en: 'Talk' }
      ];
      const languageFilter = '';

      const filtered = talks.filter(talk => {
        if (languageFilter && talk.talk_language !== languageFilter) return false;
        return true;
      });

      expect(filtered).toHaveLength(2);
    });
  });

  describe('filterByType', () => {
    it('should include talks matching the type filter', () => {
      const talks = [
        { name_es: 'Talk 1', type: 'talk' },
        { name_es: 'Workshop 1', type: 'workshop' },
        { name_es: 'Talk 2', type: 'talk' },
        { name_es: 'Podcast 1', type: 'podcast' }
      ];
      const typeFilter = 'talk';

      const filtered = talks.filter(talk => {
        if (typeFilter && talk.type !== typeFilter) return false;
        return true;
      });

      expect(filtered).toHaveLength(2);
      expect(filtered[0].type).toBe('talk');
      expect(filtered[1].type).toBe('talk');
    });

    it('should include all talks when type filter is empty', () => {
      const talks = [
        { name_es: 'Talk', type: 'talk' },
        { name_es: 'Workshop', type: 'workshop' }
      ];
      const typeFilter = '';

      const filtered = talks.filter(talk => {
        if (typeFilter && talk.type !== typeFilter) return false;
        return true;
      });

      expect(filtered).toHaveLength(2);
    });
  });

  describe('filterByCore', () => {
    it('should only include core talks when filter is enabled', () => {
      const talks = [
        { name_es: 'Core Talk 1', core: true },
        { name_es: 'Regular Talk', core: false },
        { name_es: 'Core Talk 2', core: true },
        { name_es: 'Talk without core field' }
      ];
      const coreFilter = true;

      const filtered = talks.filter(talk => {
        if (coreFilter && !talk.core) return false;
        return true;
      });

      expect(filtered).toHaveLength(2);
      expect(filtered[0].core).toBe(true);
      expect(filtered[1].core).toBe(true);
    });

    it('should include all talks when core filter is disabled', () => {
      const talks = [
        { name_es: 'Core Talk', core: true },
        { name_es: 'Regular Talk', core: false }
      ];
      const coreFilter = false;

      const filtered = talks.filter(talk => {
        if (coreFilter && !talk.core) return false;
        return true;
      });

      expect(filtered).toHaveLength(2);
    });
  });

  describe('filterBySearch', () => {
    it('should find talk by name', () => {
      const talks = [
        { name_es: 'TDD en la práctica', place: 'Madrid' },
        { name_es: 'Clean Code', place: 'Barcelona' }
      ];
      const searchQuery = 'tdd';

      const filtered = talks.filter(talk => {
        if (searchQuery) {
          const searchableText = [
            getTalkField(talk, 'name', 'es'),
            getTalkField(talk, 'description', 'es'),
            talk.place,
            getTalkField(talk, 'key_learning', 'es')
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!searchableText.includes(searchQuery)) return false;
        }
        return true;
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name_es).toBe('TDD en la práctica');
    });

    it('should find talk by place', () => {
      const talks = [
        { name_es: 'Talk 1', place: 'BarcelonaSoftwareCrafters' },
        { name_es: 'Talk 2', place: 'Madrid' }
      ];
      const searchQuery = 'barcelona';

      const filtered = talks.filter(talk => {
        if (searchQuery) {
          const searchableText = [
            getTalkField(talk, 'name', 'es'),
            getTalkField(talk, 'description', 'es'),
            talk.place,
            getTalkField(talk, 'key_learning', 'es')
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!searchableText.includes(searchQuery)) return false;
        }
        return true;
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].place).toBe('BarcelonaSoftwareCrafters');
    });

    it('should be case insensitive', () => {
      const talks = [
        { name_es: 'Clean Code Workshop', place: 'Madrid' },
        { name_es: 'TDD', place: 'Barcelona' }
      ];
      const searchQuery = 'CLEAN';

      const filtered = talks.filter(talk => {
        if (searchQuery.toLowerCase()) {
          const searchableText = [
            getTalkField(talk, 'name', 'es'),
            getTalkField(talk, 'description', 'es'),
            talk.place,
            getTalkField(talk, 'key_learning', 'es')
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!searchableText.includes(searchQuery.toLowerCase())) return false;
        }
        return true;
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name_es).toBe('Clean Code Workshop');
    });

    it('should return no results when search does not match', () => {
      const talks = [
        { name_es: 'TDD', place: 'Madrid' },
        { name_es: 'Clean Code', place: 'Barcelona' }
      ];
      const searchQuery = 'nonexistent';

      const filtered = talks.filter(talk => {
        if (searchQuery) {
          const searchableText = [
            getTalkField(talk, 'name', 'es'),
            getTalkField(talk, 'description', 'es'),
            talk.place,
            getTalkField(talk, 'key_learning', 'es')
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!searchableText.includes(searchQuery)) return false;
        }
        return true;
      });

      expect(filtered).toHaveLength(0);
    });

    it('should return all talks when search query is empty', () => {
      const talks = [
        { name_es: 'TDD', place: 'Madrid' },
        { name_es: 'Clean Code', place: 'Barcelona' }
      ];
      const searchQuery = '';

      const filtered = talks.filter(talk => {
        if (searchQuery) {
          const searchableText = [
            getTalkField(talk, 'name', 'es'),
            getTalkField(talk, 'description', 'es'),
            talk.place,
            getTalkField(talk, 'key_learning', 'es')
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!searchableText.includes(searchQuery)) return false;
        }
        return true;
      });

      expect(filtered).toHaveLength(2);
    });

    it('should handle talks with missing fields gracefully', () => {
      const talks = [
        { name_es: 'Talk with all fields', description_es: 'desc', place: 'Madrid' },
        { place: 'Barcelona' }
      ];
      const searchQuery = 'madrid';

      const filtered = talks.filter(talk => {
        if (searchQuery) {
          const searchableText = [
            getTalkField(talk, 'name', 'es'),
            getTalkField(talk, 'description', 'es'),
            talk.place,
            getTalkField(talk, 'key_learning', 'es')
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!searchableText.includes(searchQuery)) return false;
        }
        return true;
      });

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
      const yearFilter = '2024';
      const typeFilter = 'talk';

      const filtered = talks.filter(talk => {
        if (yearFilter && talk.year !== yearFilter) return false;
        if (typeFilter && talk.type !== typeFilter) return false;
        return true;
      });

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
      const coreFilter = true;
      const searchQuery = 'tdd';

      const filtered = talks.filter(talk => {
        if (coreFilter && !talk.core) return false;
        if (searchQuery) {
          const searchableText = [
            getTalkField(talk, 'name', 'es'),
            getTalkField(talk, 'description', 'es'),
            talk.place,
            getTalkField(talk, 'key_learning', 'es')
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!searchableText.includes(searchQuery)) return false;
        }
        return true;
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name_es).toBe('TDD Workshop');
      expect(filtered[0].core).toBe(true);
    });

    it('should apply all filters together', () => {
      const talks = [
        {
          year: '2024',
          type: 'talk',
          talk_language: 'Spanish',
          core: true,
          name_es: 'TDD en práctica',
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
          name_es: 'TDD Básico',
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
      const yearFilter = '2024';
      const typeFilter = 'talk';
      const languageFilter = 'Spanish';
      const coreFilter = true;
      const searchQuery = 'tdd';

      const filtered = talks.filter(talk => {
        if (yearFilter && talk.year !== yearFilter) return false;
        if (languageFilter && talk.talk_language !== languageFilter) return false;
        if (typeFilter && talk.type !== typeFilter) return false;
        if (coreFilter && !talk.core) return false;
        if (searchQuery) {
          const searchableText = [
            getTalkField(talk, 'name', 'es'),
            getTalkField(talk, 'description', 'es'),
            talk.place,
            getTalkField(talk, 'key_learning', 'es')
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          if (!searchableText.includes(searchQuery)) return false;
        }
        return true;
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name_es).toBe('TDD en práctica');
    });
  });
});
