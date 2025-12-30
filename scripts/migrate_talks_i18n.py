#!/usr/bin/env python3
"""
Migration script to transform talks.json to new i18n structure with language suffixes.

Changes:
- Rename 'language' to 'talk_language'
- Split translatable fields into _es and _en variants:
  - name -> name_es, name_en
  - description -> description_es, description_en
  - key_learning -> key_learning_es, key_learning_en
  - key_points -> key_points_es, key_points_en
"""

import json
from pathlib import Path
from typing import Any, Dict


def migrate_talk(talk: Dict[str, Any]) -> Dict[str, Any]:
    """Migrate a single talk to the new i18n structure."""
    migrated = {}

    # Copy non-translatable fields as-is
    non_translatable = [
        'year', 'date', 'blog', 'video', 'presentation',
        'place', 'coauthors', 'last_modified', 'core'
    ]
    for field in non_translatable:
        if field in talk:
            migrated[field] = talk[field]

    # Rename 'language' to 'talk_language'
    if 'language' in talk:
        migrated['talk_language'] = talk['language']

    # Translatable fields: currently in English, need both _es and _en
    translatable = ['name', 'description', 'key_learning', 'key_points']

    for field in translatable:
        value = talk.get(field)
        # Current content is in English
        migrated[f'{field}_en'] = value
        # Spanish version is null for now (to be translated)
        migrated[f'{field}_es'] = None

    return migrated


def migrate_talks_json(input_path: Path, output_path: Path) -> None:
    """Migrate the entire talks.json file."""
    with open(input_path, 'r', encoding='utf-8') as f:
        talks = json.load(f)

    migrated_talks = [migrate_talk(talk) for talk in talks]

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(migrated_talks, f, indent=2, ensure_ascii=False)

    print(f"✅ Migrated {len(migrated_talks)} talks")
    print(f"   Input:  {input_path}")
    print(f"   Output: {output_path}")


if __name__ == '__main__':
    project_root = Path(__file__).parent.parent
    input_file = project_root / 'data' / 'talks.json'
    output_file = project_root / 'data' / 'talks.migrated.json'

    migrate_talks_json(input_file, output_file)
