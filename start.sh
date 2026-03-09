#!/bin/sh

# Start the Node server in the background
node server/dist/index.js &


# Wait for Node server to be available before exposing frontend
MAX_TRIES=20
COUNT=0

until nc -z 0.0.0.0 4000; do
  COUNT=$((COUNT + 1))
  if [ $COUNT -ge $MAX_TRIES ]; then
    echo "Server did not start after $MAX_TRIES attempts, exiting"
    exit 1
  fi
  echo "Waiting for server... attempt $COUNT/$MAX_TRIES"
  sleep 0.5
done

echo "Server is up"


# Start nginx in the foreground
nginx -g 'daemon off;'