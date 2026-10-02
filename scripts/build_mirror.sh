#!/usr/bin/env bash
# Build ./mirror: a full copy of the LIVE More Space site (from Netlify's file
# list), with this repo's approved blog/ overlaid on top. Deploying the mirror
# therefore never drops a page that is live today (admin/, project pages, ...)
# — it only adds or updates blog files.
#
# Requires NETLIFY_TOKEN. Run from the repo root.
set -euo pipefail

SITE="${NETLIFY_SITE_ID:-964e086b-1cf2-47f7-8b78-16909d268319}"
ORIGIN="${SITE_ORIGIN:-https://morespace.netlify.app}"
: "${NETLIFY_TOKEN:?NETLIFY_TOKEN not set}"

rm -rf mirror && mkdir -p mirror
curl -sf -H "Authorization: Bearer $NETLIFY_TOKEN" \
  "https://api.netlify.com/api/v1/sites/$SITE/files" > files.json
echo "live file count: $(jq length files.json)"

FAIL=0
for p in $(jq -r '.[].path' files.json); do
  mkdir -p "mirror$(dirname "$p")"
  curl -sfL --retry 2 "$ORIGIN$p" -o "mirror$p" || { echo "MISS $p"; FAIL=$((FAIL+1)); }
done
echo "download misses: $FAIL"; test "$FAIL" -lt 5
test -s mirror/index.html || { echo "live index.html missing from mirror — refusing to deploy"; exit 1; }

# Overlay the approved blog. Only SM Manager writes here, and only after the
# owner approved the exact post in the dashboard.
if [ -d blog ]; then
  mkdir -p mirror/blog
  cp -a blog/. mirror/blog/
fi
echo "mirror files: $(find mirror -type f | wc -l)"
