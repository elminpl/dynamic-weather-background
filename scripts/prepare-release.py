"""Prepare a release from the current version and the changelog's pending entries."""

import argparse
from datetime import datetime, timezone
from pathlib import Path
import re
import sys

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("bump", choices=("patch", "minor", "major"))
args = parser.parse_args()

root = Path(__file__).resolve().parent.parent
module = root / "dist/dynamic-weather-background.js"
readme = root / "README.md"
changelog = root / "CHANGELOG.md"
source = module.read_text(encoding="utf-8")
readme_text = readme.read_text(encoding="utf-8")
history = changelog.read_text(encoding="utf-8")
version = re.search(r'^export const VERSION = "(\d+\.\d+\.\d+)";$', source, re.M)
if not version:
    sys.exit("Brak prawidłowego numeru VERSION w module.")

current = version[1]
major, minor, patch = map(int, current.split("."))
next_version = {
    "patch": f"{major}.{minor}.{patch + 1}",
    "minor": f"{major}.{minor + 1}.0",
    "major": f"{major + 1}.0.0",
}[args.bump]

if re.search(rf"^## {re.escape(next_version)}\b", history, re.M):
    sys.exit(f"Wersja {next_version} jest już w historii zmian.")

def replace_once(text, old, new):
    if text.count(old) != 1:
        sys.exit(f"Oczekiwano jednego wpisu: {old}")
    return text.replace(old, new, 1)

source = replace_once(source, f'Dynamic Weather Background v{current} |', f'Dynamic Weather Background v{next_version} |')
source = replace_once(source, version[0], f'export const VERSION = "{next_version}";')
for label in ("Source version", "Wersja źródłowa"):
    readme_text = replace_once(readme_text, f"**{label}:** {current}", f"**{label}:** {next_version}")

today = datetime.now(timezone.utc).date().isoformat()
for heading in ("Unreleased", "Niewydane"):
    pending = re.search(rf"^## {heading}\n(.*?)(?=^## |^---$|\Z)", history, re.M | re.S)
    if not pending or not re.search(r"^- \S", pending[1], re.M):
        sys.exit(f"Add release notes under {heading} before publishing.")
    section = f"## {heading}\n\n## {next_version} ({today})\n\n{pending[1].strip()}\n\n"
    history = history[:pending.start()] + section + history[pending.end():]

for path, content in ((module, source), (readme, readme_text), (changelog, history)):
    path.write_text(content, encoding="utf-8")

print(next_version)
