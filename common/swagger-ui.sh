#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
PORT=8082

echo "Running Swagger UI on port $PORT"

# Run Swagger UI via Docker
docker run \
    -p $PORT:8080 \
    -e SWAGGER_JSON=/foo/openapi-api.yaml \
    -v $SCRIPT_DIR:/foo swaggerapi/swagger-ui