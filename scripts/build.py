#!/usr/bin/env python3
"""
Build step for Our Beautiful America.

Reads the markdown content files that the Decap CMS admin panel edits
(content/news/*.md and content/chapters/*.md) and turns them into small
JSON manifests that the static site's JavaScript fetches at page load.

No third-party dependencies, so it runs the same way locally as it does
in the GitHub Actions workflow.

Usage: python3 scripts/build.py
"""

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def parse_frontmatter(text):
    """Split a '---\\nkey: value\\n---\\nbody' file into (fields dict, body string)."""
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n?(.*)$", text, re.DOTALL)
    if not match:
        return {}, text.strip()

    raw_fields, body = match.group(1), match.group(2)
    fields = {}
    for line in raw_fields.splitlines():
        line = line.strip()
        if not line or ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if value.startswith('"') and value.endswith('"'):
            value = value[1:-1]
        elif value.startswith("'") and value.endswith("'"):
            value = value[1:-1]
        fields[key] = value
    return fields, body.strip()


def load_folder(folder_path):
    entries = []
    if not os.path.isdir(folder_path):
        return entries
    for filename in sorted(os.listdir(folder_path)):
        if not filename.endswith(".md"):
            continue
        file_path = os.path.join(folder_path, filename)
        with open(file_path, "r", encoding="utf-8") as handle:
            fields, body = parse_frontmatter(handle.read())
        fields["body"] = body
        fields["slug"] = filename[:-3]
        entries.append(fields)
    return entries


def build_news():
    entries = load_folder(os.path.join(ROOT, "content", "news"))
    # Newest first, using the "date" field when present, falling back to slug.
    entries.sort(key=lambda e: e.get("date", e.get("slug", "")), reverse=True)
    out_path = os.path.join(ROOT, "content", "news", "manifest.json")
    with open(out_path, "w", encoding="utf-8") as handle:
        json.dump(entries, handle, indent=2)
        handle.write("\n")
    print(f"Wrote {len(entries)} news entries to {out_path}")


def build_chapters():
    entries = load_folder(os.path.join(ROOT, "content", "chapters"))
    entries.sort(key=lambda e: e.get("name", ""))
    out_path = os.path.join(ROOT, "content", "chapters", "manifest.json")
    with open(out_path, "w", encoding="utf-8") as handle:
        json.dump(entries, handle, indent=2)
        handle.write("\n")
    print(f"Wrote {len(entries)} chapter entries to {out_path}")


if __name__ == "__main__":
    build_news()
    build_chapters()
    sys.exit(0)
