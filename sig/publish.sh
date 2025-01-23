#!/bin/bash

# Get the directory of the script
SCRIPT_DIR=$(dirname "$0")

# Change to the script's directory
cd "$SCRIPT_DIR"

# Check if there are no git changes
if git diff --quiet --exit-code -- .; then
    echo "No changes detected in the 'sig' folder."

    # Build the package
    echo "Building the package..."
    npm run build

    # Bump the package version with a patch
    echo "Bumping the package version..."
    npm version patch

    # Get the new version
    VERSION=$(npm pkg get version | tr -d '"')

    # Set git tag with the version and push it
    echo "Setting git tag and pushing..."
    git add .
    git commit -m "Bump version to $VERSION"
    git tag "v$VERSION"
    git push origin main
    git push origin "v$VERSION"

    # Publish the library
    echo "Publishing the library..."
    # npm publish --access public

    echo "Done."
else
    echo "There are changes in the 'sig' folder. Please commit or stash them before running this script."
fi