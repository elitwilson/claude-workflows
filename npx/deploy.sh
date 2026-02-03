#!/bin/sh
set -e

cd "$(dirname "$0")"

BUMP=$1

if [ "$BUMP" != "major" ] && [ "$BUMP" != "minor" ] && [ "$BUMP" != "patch" ]; then
  echo "Usage: ./deploy.sh <major|minor|patch>"
  exit 1
fi

# Fail fast: nothing has changed yet, no cleanup needed
if [ -n "$(git status --porcelain .)" ]; then
  echo "Working tree is dirty. Commit or stash changes first."
  exit 1
fi

echo "Running tests..."
pnpm test:run

echo "Bumping version ($BUMP)..."
pnpm version "$BUMP" --no-git-tag-version

VERSION=$(grep '"version"' package.json | head -1 | cut -d'"' -f4)
echo "New version: v$VERSION"

# Roll back the version bump if build or publish fails
rollback() {
  echo "Deploy failed, rolling back version bump..."
  git checkout -- package.json
}
trap rollback EXIT

echo "Building..."
pnpm build

echo "Publishing v$VERSION..."
pnpm publish --no-git-checks

# Publish succeeded — disable rollback, then commit and tag
trap - EXIT

echo "Committing and tagging..."
git add package.json
git commit -m "chore: bump version to v$VERSION"
git tag "v$VERSION"

echo "Done! v$VERSION published and tagged."
