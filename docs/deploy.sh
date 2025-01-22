#!/bin/bash
# Get the directory of the script
SCRIPT_DIR=$(dirname "$0")

# Change to the script's directory
cd "$SCRIPT_DIR"

# Check for changes in the docs folder
if git diff --quiet --exit-code -- .; then
  echo "No changes in the docs folder. Proceeding with deployment..."
  npm run build
  npm run deploy
else
  echo "There are changes in the docs folder. Please commit your changes before deploying."
  exit 1
fi