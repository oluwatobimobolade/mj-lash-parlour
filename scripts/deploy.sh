#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "🚀 Deploying site to Cloudflare Pages (mjlash)..."
npx wrangler pages deploy site --project-name mjlash
echo "✅ Live at: https://mjlash.pages.dev/"
