#!/bin/sh

# Wake-up backend in background to minimize user delays
wget -q -O /dev/null https://hotplants-server.fly.dev/health

# Start the Node server in the background
node server/dist/index.js &


# Wait for Node proxy server to be available before exposing frontend
MAX_TRIES=20
COUNT=0

until nc -z 0.0.0.0 4000; do
  COUNT=$((COUNT + 1))
  if [ $COUNT -ge $MAX_TRIES ]; then
    echo "Proxy server did not start after $MAX_TRIES attempts, exiting"
    exit 1
  fi
  echo "Waiting for proxy server... attempt $COUNT/$MAX_TRIES"
  sleep 0.5
done

# Start nginx in the foreground
nginx -g 'daemon off;'