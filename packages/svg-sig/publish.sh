#!/bin/bash
set -e

# Get the directory of the script
SCRIPT_DIR=$(dirname "$0")

# Change to the script's directory
cd "$SCRIPT_DIR"

# Check if there are no git changes
if git diff --quiet --exit-code -- .; then
    echo "No changes detected in the 'svg-sig' folder."

    # Bump the package version with a patch
    echo "Bumping the package version..."
    npm version patch

    # Get the new version
    VERSION=$(npm pkg get version | tr -d '"')

    # Confirm with the user before proceeding
    read -p "Are you sure you want to proceed with publishing the new version $VERSION? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Publishing aborted."
        exit 1
    fi

    echo "----------------------------------------"

    # Set git tag with the version and push it
    echo "Setting git tag and pushing..."
    git add .
    git commit -m "Bump version to $VERSION"
    git tag "svg-sig/v$VERSION"
    git push origin main --tags

    # Validate that the new tag was actually pushed
    if git ls-remote --tags origin | grep -q "refs/tags/svg-sig/v$VERSION"; then
        echo "Tag svg-sig/v$VERSION was successfully pushed."
    else
        echo "Failed to push tag svg-sig/v$VERSION."
        exit 1
    fi

    echo "----------------------------------------"

    # Publish the library
    echo "Publishing the library..."
    npm publish --access public

    echo "Done."
else
    echo "There are changes in the 'svg-sig' folder. Please commit or stash them before running this script."
fi