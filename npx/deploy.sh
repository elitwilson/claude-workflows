#!/bin/sh
set -e

cd "$(dirname "$0")"

BUMP=$1

if [ "$BUMP" != "major" ] && [ "$BUMP" != "minor" ] && [ "$BUMP" != "patch" ]; then
  echo "Usage: ./deploy.sh <major|minor|patch>"
  exit 1
fi

echo "Running tests..."
pnpm test:run

echo "Bumping version ($BUMP)..."
pnpm version "$BUMP" --no-git-tag-version

VERSION=$(grep '"version"' package.json | head -1 | cut -d'"' -f4)
echo "New version: v$VERSION"

echo "Building..."
pnpm build

echo "Committing and tagging..."
git add package.json
git commit -m "chore: bump version to v$VERSION"
git tag "v$VERSION"

echo "Publishing v$VERSION..."
pnpm publish

echo "Done! v$VERSION published and tagged."
