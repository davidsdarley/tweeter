// AI-assisted: I asked Claude in a chat for a script to speed this up and it generated the following
#!/bin/bash
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