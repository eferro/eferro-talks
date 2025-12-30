#!/usr/bin/env python3
"""Verify translation quality and consistency in talks.json"""

import json
from pathlib import Path
from typing import Dict, List, Set
from collections import defaultdict


def load_talks() -> List[Dict]:
    """Load talks from JSON file"""
    talks_file = Path(__file__).parent.parent / "data" / "talks.json"
    with open(talks_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    # Handle both list and object formats
    if isinstance(data, list):
        return data
    return data.get('talks', [])


def check_required_fields(talks: List[Dict]) -> Dict:
    """Verify all required fields have translations"""
    results = {
        'total_talks': len(talks),
        'with_name_es': 0,
        'with_description_es': 0,
        'with_key_learning_es': 0,
        'with_key_points_es': 0,
        'missing_translations': []
    }

    for talk in talks:
        talk_id = talk.get('id', 'unknown')
        missing = []

        if talk.get('name_es'):
            results['with_name_es'] += 1
        else:
            missing.append('name_es')

        # Only check other fields if English version exists
        if talk.get('description_en'):
            if talk.get('description_es'):
                results['with_description_es'] += 1
            else:
                missing.append('description_es')

        if talk.get('key_learning_en'):
            if talk.get('key_learning_es'):
                results['with_key_learning_es'] += 1
            else:
                missing.append('key_learning_es')

        if talk.get('key_points_en'):
            if talk.get('key_points_es'):
                results['with_key_points_es'] += 1
            else:
                missing.append('key_points_es')

        if missing:
            results['missing_translations'].append({
                'id': talk_id,
                'name': talk.get('name_en', 'N/A'),
                'missing_fields': missing
            })

    return results


def check_technical_terms(talks: List[Dict]) -> Dict:
    """Check for common technical terms that should remain in English"""
    technical_terms = [
        'TDD', 'DevOps', 'MVP', 'continuous delivery', 'pipeline',
        'deploy', 'API', 'frontend', 'backend', 'test', 'refactoring',
        'pull request', 'commit', 'SOLID', 'clean code', 'sprint',
        'backlog', 'feature flag', 'microservices'
    ]

    results = {
        'total_checked': 0,
        'terms_found': defaultdict(int),
        'potential_issues': []
    }

    for talk in talks:
        for field in ['description_es', 'key_learning_es']:
            content = talk.get(field, '')
            if content:
                results['total_checked'] += 1
                for term in technical_terms:
                    if term.lower() in content.lower():
                        results['terms_found'][term] += 1

        # Check key_points_es (list)
        key_points = talk.get('key_points_es') or []
        for point in key_points:
            results['total_checked'] += 1
            for term in technical_terms:
                if term.lower() in point.lower():
                    results['terms_found'][term] += 1

    return results


def check_translation_completeness(talks: List[Dict]) -> Dict:
    """Check translation completeness by category"""
    results = {
        'core_talks': {'total': 0, 'fully_translated': 0},
        'non_core_talks': {'total': 0, 'fully_translated': 0},
        'by_year': defaultdict(lambda: {'total': 0, 'fully_translated': 0})
    }

    for talk in talks:
        is_core = talk.get('core', False)
        year = talk.get('year', 'unknown')

        # Check if fully translated (has all fields that exist in English)
        fully_translated = bool(talk.get('name_es'))

        if talk.get('description_en'):
            fully_translated = fully_translated and bool(talk.get('description_es'))
        if talk.get('key_learning_en'):
            fully_translated = fully_translated and bool(talk.get('key_learning_es'))
        if talk.get('key_points_en'):
            fully_translated = fully_translated and bool(talk.get('key_points_es'))

        # Update stats
        if is_core:
            results['core_talks']['total'] += 1
            if fully_translated:
                results['core_talks']['fully_translated'] += 1
        else:
            results['non_core_talks']['total'] += 1
            if fully_translated:
                results['non_core_talks']['fully_translated'] += 1

        results['by_year'][year]['total'] += 1
        if fully_translated:
            results['by_year'][year]['fully_translated'] += 1

    return results


def generate_report():
    """Generate complete verification report"""
    print("=" * 70)
    print("TRANSLATION QUALITY VERIFICATION REPORT")
    print("=" * 70)
    print()

    talks = load_talks()

    # 1. Required Fields Check
    print("1. REQUIRED FIELDS VERIFICATION")
    print("-" * 70)
    field_results = check_required_fields(talks)
    print(f"Total talks: {field_results['total_talks']}")
    print(f"✓ With name_es: {field_results['with_name_es']}/{field_results['total_talks']}")
    print(f"✓ With description_es: {field_results['with_description_es']} (where description_en exists)")
    print(f"✓ With key_learning_es: {field_results['with_key_learning_es']} (where key_learning_en exists)")
    print(f"✓ With key_points_es: {field_results['with_key_points_es']} (where key_points_en exists)")

    if field_results['missing_translations']:
        print(f"\n⚠ Missing translations: {len(field_results['missing_translations'])}")
        for item in field_results['missing_translations'][:5]:
            print(f"  - {item['id']}: {item['name']} - missing {', '.join(item['missing_fields'])}")
    else:
        print("\n✅ All required translations are complete!")
    print()

    # 2. Technical Terms Check
    print("2. TECHNICAL TERMS CONSISTENCY")
    print("-" * 70)
    term_results = check_technical_terms(talks)
    print(f"Fields checked: {term_results['total_checked']}")
    print(f"Technical terms found (top 10):")
    sorted_terms = sorted(term_results['terms_found'].items(), key=lambda x: x[1], reverse=True)
    for term, count in sorted_terms[:10]:
        print(f"  - {term}: {count} occurrences")
    print()

    # 3. Completeness by Category
    print("3. TRANSLATION COMPLETENESS BY CATEGORY")
    print("-" * 70)
    completeness = check_translation_completeness(talks)

    core = completeness['core_talks']
    non_core = completeness['non_core_talks']

    print(f"CORE talks: {core['fully_translated']}/{core['total']} fully translated " +
          f"({100*core['fully_translated']/core['total'] if core['total'] > 0 else 0:.1f}%)")
    print(f"NON-CORE talks: {non_core['fully_translated']}/{non_core['total']} fully translated " +
          f"({100*non_core['fully_translated']/non_core['total'] if non_core['total'] > 0 else 0:.1f}%)")

    print("\nBy year:")
    for year in sorted(completeness['by_year'].keys(), reverse=True):
        stats = completeness['by_year'][year]
        pct = 100 * stats['fully_translated'] / stats['total'] if stats['total'] > 0 else 0
        print(f"  {year}: {stats['fully_translated']}/{stats['total']} ({pct:.1f}%)")

    print()
    print("=" * 70)
    print("VERIFICATION COMPLETE")
    print("=" * 70)


if __name__ == '__main__':
    generate_report()
