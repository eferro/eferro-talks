import { describe, it, expect } from 'vitest';

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
});
