#!/bin/bash
set -euo pipefail

project_dir="$(cd "$(dirname "$0")/.." && pwd)"
preview_dir="/Users/admin/Library/Caches/aios-exhibition-preview"

cd "$project_dir"
npm run build
mkdir -p "$preview_dir"
rsync -a --delete "$project_dir/dist/" "$preview_dir/"

echo "AIOS preview synced to $preview_dir"
