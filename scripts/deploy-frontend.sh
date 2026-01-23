#!/bin/bash
set -e

# Deploy frontend script
# Usage: ./scripts/deploy-frontend.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
DEPLOY_DIR="/var/www/benbodev.se/html"

echo "=== Building frontend ==="
cd "$FRONTEND_DIR"
npm run build

echo "=== Deploying to $DEPLOY_DIR ==="
sudo rm -rf "$DEPLOY_DIR"/*
sudo cp -r "$FRONTEND_DIR/dist"/* "$DEPLOY_DIR"/
sudo chown -R www-data:www-data "$DEPLOY_DIR"

echo "=== Done! ==="
echo "Site: https://benbodev.se"
