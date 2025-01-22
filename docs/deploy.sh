#!/bin/bash

# Check for changes in the docs folder
if git diff --quiet --exit-code docs; then
  echo "No changes in the docs folder. Proceeding with deployment..."
  npm run deploy
else
  echo "There are changes in the docs folder. Please commit your changes before deploying."
  exit 1
fi