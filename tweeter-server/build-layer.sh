#!/bin/bash
#AI-assisted: I asked Claude in a chat for a script to speed this up and it generated the following
set -e   # stop if any command fails

# Start fresh each time
rm -rf layer
mkdir -p layer/nodejs/node_modules/tweeter-shared

# Copy the compiled shared module into the layer
cp ../tweeter-shared/package.json layer/nodejs/node_modules/tweeter-shared/
cp -R ../tweeter-shared/dist layer/nodejs/node_modules/tweeter-shared/

# Install tweeter-shared's own runtime dependencies (if it has any)
cd layer/nodejs/node_modules/tweeter-shared
npm install --omit=dev

# Install the server's runtime deps that Lambda doesn't provide
cd - > /dev/null   # back to tweeter-server/
npm install --prefix layer/nodejs --no-save --no-package-lock bcryptjs@^3.0.3