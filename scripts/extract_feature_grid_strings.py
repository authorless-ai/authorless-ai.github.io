#!/usr/bin/env python3
"""
Extract translatable strings from feature grid YAML files and write them
to Hugo i18n TOML locale files.

Keys are derived deterministically from the grid's `prefix` field and the
stable `id` fields on each element — never from the English text itself.

Safe to re-run: existing keys in locale files are never overwritten.

Usage:
    python scripts/extract_feature_grid_strings.py [--dry-run]
"""

import argparse
import glob
import os
import re
import sys

import yaml


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
I18N_DIR = os.path.join(PROJECT_ROOT, "themes", "my-saas", "i18n")

LOCALES = ["en", "fr", "es", "de", "pt", "it"]


def collect_strings(grid: dict) -> list[tuple[str, str]]:
    """Walk a feature grid dict and return a list of (i18n_key, english_value) pairs."""
    prefix = grid["prefix"]
    pairs: list[tuple[str, str]] = []

    # Grid title & subtitle
    if grid.get("title"):
        pairs.append((f"{prefix}__title", grid["title"]))
    if grid.get("subtitle"):
        pairs.append((f"{prefix}__subtitle", grid["subtitle"]))

    # Column headings
    columns = grid.get("columns", [])
    for col in columns:
        col_id = col["id"]
        pairs.append((f"{prefix}__{col_id}", col["heading"]))

    # Sections, rows, cell values
    for section in grid.get("sections", []):
        sec_id = section["id"]
        if section.get("name"):
            pairs.append((f"{prefix}__{sec_id}", section["name"]))

        for row in section.get("rows", []):
            row_id = row["id"]
            # Feature label
            if row.get("feature"):
                pairs.append((f"{prefix}__{sec_id}__{row_id}", row["feature"]))

            # Cell values (positional — matched to columns by index)
            for idx, val in enumerate(row.get("values", [])):
                if val.get("text"):
                    col_id = columns[idx]["id"] if idx < len(columns) else f"col{idx}"
                    pairs.append(
                        (f"{prefix}__{sec_id}__{row_id}__{col_id}", val["text"])
                    )

    return pairs


def parse_toml_keys(filepath: str) -> set[str]:
    """Parse a Hugo i18n TOML file and return the set of existing keys."""
    keys: set[str] = set()
    if not os.path.exists(filepath):
        return keys
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            m = re.match(r"^\[(\S+)\]", line.strip())
            if m:
                keys.add(m.group(1))
    return keys


def append_to_toml(
    filepath: str,
    pairs: list[tuple[str, str]],
    is_english: bool,
    dry_run: bool,
) -> int:
    """Append new i18n entries to a TOML file. Returns count of new keys added."""
    existing = parse_toml_keys(filepath)
    new_pairs = [(k, v) for k, v in pairs if k not in existing]
    if not new_pairs:
        return 0

    lines: list[str] = []
    for key, value in new_pairs:
        escaped = value.replace('"', '\\"')
        lines.append(f"\n[{key}]")
        if is_english:
            lines.append(f'other = "{escaped}"')
        else:
            lines.append(f'other = "{escaped}"  # TODO: translate')

    if dry_run:
        locale = os.path.basename(filepath)
        for line in lines:
            print(f"  [{locale}] {line.strip()}")
    else:
        with open(filepath, "a", encoding="utf-8") as f:
            f.write("\n")
            f.write("\n".join(lines))
            f.write("\n")

    return len(new_pairs)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be written without modifying files",
    )
    args = parser.parse_args()

    # Find all YAML files in data/ root that have a 'prefix' key
    yaml_files = glob.glob(os.path.join(DATA_DIR, "*.yaml")) + glob.glob(
        os.path.join(DATA_DIR, "*.yml")
    )

    all_pairs: list[tuple[str, str]] = []

    for filepath in sorted(yaml_files):
        with open(filepath, "r", encoding="utf-8") as f:
            try:
                data = yaml.safe_load(f)
            except yaml.YAMLError as e:
                print(f"WARNING: Skipping {filepath}: {e}", file=sys.stderr)
                continue

        if not isinstance(data, dict) or "prefix" not in data:
            continue

        pairs = collect_strings(data)
        basename = os.path.basename(filepath)
        if args.dry_run:
            print(f"\n{basename}: {len(pairs)} strings")
            for key, value in pairs:
                print(f"  {key} = \"{value}\"")

        all_pairs.extend(pairs)

    if not all_pairs:
        print("No feature grid YAML files with 'prefix' found in data/")
        return

    # Write to each locale's TOML file
    total_new = 0
    for locale in LOCALES:
        toml_path = os.path.join(I18N_DIR, f"{locale}.toml")
        if not os.path.exists(toml_path):
            print(
                f"WARNING: Locale file not found: {toml_path}",
                file=sys.stderr,
            )
            continue
        is_english = locale == "en"
        count = append_to_toml(toml_path, all_pairs, is_english, args.dry_run)
        total_new += count
        if count and not args.dry_run:
            print(f"  {locale}.toml: added {count} new keys")

    if args.dry_run:
        print(f"\nDry run complete. {len(all_pairs)} total strings found.")
    else:
        print(f"\nDone. {total_new} new key entries added across all locales.")


if __name__ == "__main__":
    main()
