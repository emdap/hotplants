#!/bin/sh

# Start the Node server in the background
node server/dist/index.js &

# Start nginx in the foreground
nginx -g 'daemon off;'