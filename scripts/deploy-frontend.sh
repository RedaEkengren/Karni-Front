#!/bin/bash
set -e

# Deploy frontend script
# Usage: ./scripts/deploy-frontend.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

echo "=== Building frontend ==="
cd "$FRONTEND_DIR"
npm install
npm run build

echo "=== Frontend deployed to frontend/dist ==="
echo "Nginx serves from: /opt/karni/frontend/dist"
