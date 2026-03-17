#!/usr/bin/env python3
"""Convert talks.json to CSV format for Airtable import."""

import csv
import json
from pathlib import Path


def main() -> None:
    project_root = Path(__file__).parent.parent
    json_path = project_root / "data" / "talks.json"
    csv_path = project_root / "data" / "talks.csv"

    with open(json_path, encoding="utf-8") as f:
        talks = json.load(f)

    fieldnames = [
        "year",
        "date",
        "blog",
        "video",
        "presentation",
        "place",
        "coauthors",
        "last_modified",
        "core",
        "type",
        "talk_language",
        "name_en",
        "name_es",
        "description_en",
        "description_es",
        "key_learning_en",
        "key_learning_es",
        "key_points_en",
        "key_points_es",
    ]

    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_ALL)
        writer.writeheader()

        for talk in talks:
            row = {}
            for field in fieldnames:
                value = talk.get(field)
                if value is None:
                    row[field] = ""
                elif isinstance(value, bool):
                    row[field] = "true" if value else "false"
                else:
                    row[field] = str(value)
            writer.writerow(row)

    print(f"CSV generated: {csv_path}")
    print(f"Total talks exported: {len(talks)}")


if __name__ == "__main__":
    main()

