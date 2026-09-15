#!/bin/bash
set -euo pipefail

project_dir="$(cd "$(dirname "$0")/.." && pwd)"
service_id="com.aios.exhibition.preview5186"
service_source="$project_dir/ops/$service_id.plist"
service_target="/Users/admin/Library/LaunchAgents/$service_id.plist"
service_domain="gui/$(id -u)"

bash "$project_dir/scripts/sync-preview.sh"
mkdir -p "/Users/admin/Library/LaunchAgents"
cp "$service_source" "$service_target"
launchctl bootout "$service_domain/$service_id" 2>/dev/null || true
launchctl bootstrap "$service_domain" "$service_target"
launchctl kickstart -k "$service_domain/$service_id"

echo "AIOS preview service installed at http://127.0.0.1:5186/"
