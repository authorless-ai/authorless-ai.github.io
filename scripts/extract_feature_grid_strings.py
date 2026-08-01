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

            # Optional sub-label rendered under the feature name
            if row.get("desc"):
                pairs.append(
                    (f"{prefix}__{sec_id}__{row_id}__desc", row["desc"])
                )

            # Cell values (positional — matched to columns by index)
            for idx, val in enumerate(row.get("values", [])):
                if val.get("text"):
                    col_id = columns[idx]["id"] if idx < len(columns) else f"col{idx}"
                    pairs.append(
                        (f"{prefix}__{sec_id}__{row_id}__{col_id}", val["text"])
                    )

    return pairs


def sync_toml(
    filepath: str,
    pairs: list[tuple[str, str]],
    is_english: bool,
    dry_run: bool,
) -> tuple[int, int]:
    """Sync grid strings into a Hugo i18n TOML file.

    English is the canonical language (see AGENTS.md), so for en.toml an edit to
    the source YAML overwrites the existing value. Other locales are append-only:
    new keys are added with a TODO marker, but human translations are never
    clobbered by the English text.

    Returns (added, updated).
    """
    if not os.path.exists(filepath):
        return (0, 0)

    src = open(filepath, encoding="utf-8").read()
    wanted = dict(pairs)
    locale = os.path.basename(filepath)

    # Split into the leading preamble plus one chunk per [key] block.
    chunks = re.split(r"(?m)^(?=\[)", src)
    out: list[str] = []
    seen: set[str] = set()
    updated = 0

    for chunk in chunks:
        m = re.match(r"^\[(\S+)\]", chunk)
        if not m:
            out.append(chunk)
            continue
        key = m.group(1)
        seen.add(key)

        if is_english and key in wanted:
            escaped = wanted[key].replace('"', '\\"')
            new_chunk, n = re.subn(
                r'(?m)^other = ".*"(?:\s+#.*)?$',
                f'other = "{escaped}"',
                chunk,
                count=1,
            )
            if n and new_chunk != chunk:
                updated += 1
                if dry_run:
                    print(f"  [{locale}] UPDATE {key} -> {wanted[key]}")
                chunk = new_chunk
        out.append(chunk)

    new_pairs = [(k, v) for k, v in pairs if k not in seen]
    body = "".join(out).rstrip() + "\n"

    if new_pairs:
        lines: list[str] = []
        for key, value in new_pairs:
            escaped = value.replace('"', '\\"')
            lines.append(f"\n[{key}]")
            suffix = "" if is_english else "  # TODO: translate"
            lines.append(f'other = "{escaped}"{suffix}')
        if dry_run:
            for line in lines:
                if line.strip():
                    print(f"  [{locale}] ADD {line.strip()}")
        body = body + "\n".join(lines) + "\n"

    if not dry_run and body != src:
        open(filepath, "w", encoding="utf-8").write(body)

    return (len(new_pairs), updated)


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
    total_updated = 0
    for locale in LOCALES:
        toml_path = os.path.join(I18N_DIR, f"{locale}.toml")
        if not os.path.exists(toml_path):
            print(
                f"WARNING: Locale file not found: {toml_path}",
                file=sys.stderr,
            )
            continue
        is_english = locale == "en"
        added, updated = sync_toml(
            toml_path, all_pairs, is_english, args.dry_run
        )
        total_new += added
        total_updated += updated
        if (added or updated) and not args.dry_run:
            bits = []
            if added:
                bits.append(f"added {added}")
            if updated:
                bits.append(f"updated {updated}")
            print(f"  {locale}.toml: {', '.join(bits)}")

    if args.dry_run:
        print(f"\nDry run complete. {len(all_pairs)} total strings found.")
    else:
        print(
            f"\nDone. {total_new} added, {total_updated} updated "
            f"(English re-syncs from YAML; translations are never overwritten)."
        )


if __name__ == "__main__":
    main()
