#!/bin/bash
# This script is a helper for local development only.
# TODO: put the CI/CD scripts in a clearly separate place vs local dev scripts.

set -e

USAGE="usage: push-api-server-image.sh <StackName>"

if [[ -z $1 ]]; then
    echo >&2 -e "$USAGE\n\nerror: expected a stack name."
    exit 1
fi

STACK_NAME=$1

SHA=$(git rev-parse --short HEAD)

ECR_URI=$(
    aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query "Stacks[0].Outputs[?OutputKey=='ApiServerContainerRepoUri'].OutputValue" \
        --output text
)

TAG="$ECR_URI:$SHA"

echo "Building api-server with tag: \"$TAG\""

SCRIPT_DIR=$(dirname "${BASH_SOURCE}")

docker build .. -f ${SCRIPT_DIR}/../api-server/Dockerfile \
    -t $TAG \
    --build-arg="API_SERVER_VERSION=$TAG"

# TODO: a less hacky way to do this???
# 123456.dkr.ecr.us-east-1.amazonaws.com/foo/blah -> 123456.dkr.ecr.us-east-1.amazonaws.com
ECR_HOSTNAME=$(echo "$ECR_URI" | sed 's/\/.*//')

aws ecr get-login-password | docker login \
    --username AWS \
    --password-stdin $ECR_HOSTNAME

docker push $TAG

echo "Pushed:"
echo "$TAG"
