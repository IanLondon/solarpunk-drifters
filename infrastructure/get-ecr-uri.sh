#!/bin/bash
set -e

USAGE="usage: get-ecr-uri.sh <StackName>"

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

echo $ECR_URI
