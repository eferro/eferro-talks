import { describe, it, expect, beforeEach } from 'vitest';
import {
  escapeHtml,
  getTalkField,
  createTalkId,
  updateMetaTag,
  updateOgTag,
  interfaceLanguageToContentFilter
} from '../../script-utils.js';

describe('escapeHtml', () => {
  it('should escape HTML script tags', () => {
    const input = '<script>alert("XSS")</script>';
    const result = escapeHtml(input);

    expect(result).toBe('&lt;script&gt;alert("XSS")&lt;/script&gt;');
    expect(result).not.toContain('<script>');
  });

  it('should escape special HTML characters', () => {
    const input = '< > & " \'';
    const result = escapeHtml(input);

    expect(result).toContain('&lt;');
    expect(result).toContain('&gt;');
    expect(result).toContain('&amp;');
  });

  it('should handle null input', () => {
    const result = escapeHtml(null);

    expect(result).toBe('');
  });

  it('should handle undefined input', () => {
    const result = escapeHtml(undefined);

    expect(result).toBe('');
  });

  it('should handle empty string input', () => {
    const result = escapeHtml('');

    expect(result).toBe('');
  });

  it('should escape img tags with event handlers', () => {
    const input = '<img src=x onerror="alert(1)">';
    const result = escapeHtml(input);

    expect(result).not.toContain('<img');
    expect(result).toContain('&lt;img');
  });
});

describe('getTalkField', () => {
  it('should return field in requested language when available', () => {
    const talk = {
      name_es: 'Charla en Español',
      name_en: 'Talk in English'
    };

    const result = getTalkField(talk, 'name', 'es');

    expect(result).toBe('Charla en Español');
  });

  it('should fallback to other language when requested language missing', () => {
    const talk = {
      name_es: 'Charla en Español',
      name_en: null
    };

    const result = getTalkField(talk, 'name', 'en');

    expect(result).toBe('Charla en Español');
  });

  it('should fallback to base field when both language fields missing', () => {
    const talk = {
      name: 'Base Name'
    };

    const result = getTalkField(talk, 'name', 'es');

    expect(result).toBe('Base Name');
  });

  it('should return empty string when all fields missing', () => {
    const talk = {};

    const result = getTalkField(talk, 'name', 'es');

    expect(result).toBe('');
  });

  it('should handle English to Spanish fallback', () => {
    const talk = {
      description_en: 'Description in English',
      description_es: null
    };

    const result = getTalkField(talk, 'description', 'es');

    expect(result).toBe('Description in English');
  });
});

describe('createTalkId', () => {
  it('should create ID from year and place', () => {
    const talk = {
      year: '2025',
      place: 'BarcelonaSoftwareCrafters'
    };

    const result = createTalkId(talk);

    expect(result).toBe('2025-barcelonasoftwarecrafters');
  });

  it('should replace spaces with hyphens', () => {
    const talk = {
      year: '2024',
      place: 'Pamplona Software Crafters'
    };

    const result = createTalkId(talk);

    expect(result).toBe('2024-pamplona-software-crafters');
  });

  it('should convert to lowercase', () => {
    const talk = {
      year: '2023',
      place: 'UPPERCASE EVENT'
    };

    const result = createTalkId(talk);

    expect(result).toBe('2023-uppercase-event');
  });

  it('should handle multiple consecutive spaces', () => {
    const talk = {
      year: '2022',
      place: 'Event  With   Multiple    Spaces'
    };

    const result = createTalkId(talk);

    expect(result).toBe('2022-event-with-multiple-spaces');
  });
});

describe('updateMetaTag', () => {
  beforeEach(() => {
    document.head.querySelectorAll('meta[name]').forEach(el => el.remove());
  });

  it('should create a new meta tag when none exists', () => {
    updateMetaTag('description', 'A collection of talks');

    const meta = document.querySelector('meta[name="description"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute('content')).toBe('A collection of talks');
  });

  it('should update an existing meta tag', () => {
    updateMetaTag('description', 'Original content');
    updateMetaTag('description', 'Updated content');

    const metas = document.querySelectorAll('meta[name="description"]');
    expect(metas.length).toBe(1);
    expect(metas[0].getAttribute('content')).toBe('Updated content');
  });
});

describe('interfaceLanguageToContentFilter', () => {
  it('should map es to Spanish', () => {
    const result = interfaceLanguageToContentFilter('es');

    expect(result).toBe('Spanish');
  });

  it('should map en to English', () => {
    const result = interfaceLanguageToContentFilter('en');

    expect(result).toBe('English');
  });

  it('should return empty string for unknown language', () => {
    const result = interfaceLanguageToContentFilter('fr');

    expect(result).toBe('');
  });
});

describe('updateOgTag', () => {
  beforeEach(() => {
    document.head.querySelectorAll('meta[property]').forEach(el => el.remove());
  });

  it('should create a new OG meta tag when none exists', () => {
    updateOgTag('og:title', 'My Talk');

    const meta = document.querySelector('meta[property="og:title"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute('content')).toBe('My Talk');
  });

  it('should update an existing OG meta tag', () => {
    updateOgTag('og:title', 'Original title');
    updateOgTag('og:title', 'Updated title');

    const metas = document.querySelectorAll('meta[property="og:title"]');
    expect(metas.length).toBe(1);
    expect(metas[0].getAttribute('content')).toBe('Updated title');
  });
});
