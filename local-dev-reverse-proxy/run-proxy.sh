#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
PORT=3000

docker build $SCRIPT_DIR -t spd-local-reverse-proxy

echo "Running local reverse proxy on localhost:$PORT"
echo "If this fails, you probably aren't running the other services."

docker run -p $PORT:80 --add-host=host.docker.internal:host-gateway spd-local-reverse-proxy