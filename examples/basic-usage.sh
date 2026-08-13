#!/usr/bin/env bash
# Canvora CLI — basic usage walkthrough
# Prereqs: npm install -g @canvora/cli && export CANVORA_API_KEY=vd_...
set -euo pipefail

echo "== balance =="
canvora credits --json

echo "== brand kits =="
canvora brands --json

echo "== generate a 5-slide LinkedIn carousel =="
RESULT=$(canvora generate \
  --idea "5 tips for remote work" \
  --format linkedin_carousel --slides linkedin_carousel=5 \
  --wait --json)

ID=$(echo "$RESULT" | jq -r .generation.id)
echo "generation: $ID"

echo "== output URLs (sorted by slide order) =="
echo "$RESULT" | jq -r '.generation.outputs | sort_by(.sortOrder) | .[].fileUrl'

echo "== download locally =="
canvora download "$ID" --dir ./canvora-out
