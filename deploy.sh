#!/bin/bash
set -e

if [ -f .env ]; then
  set -a && source .env && set +a
fi

PORT=${PORT:-3001}

echo "=== Deploying ==="

if ! command -v docker &>/dev/null; then
  echo "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  usermod -aG docker $USER
  echo "Docker installed. You may need to log out and back in."
fi

if ! docker compose version &>/dev/null; then
  echo "Installing Docker Compose plugin..."
  apt-get update && apt-get install -y docker-compose-plugin
fi

echo "Building and starting containers..."
docker compose up -d --build --wait

echo "=== Done ==="
echo "Container running on http://127.0.0.1:${PORT}"
echo "Add Caddy reverse proxy to this address."
