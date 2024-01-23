#!/bin/bash
set -e

USAGE="usage: get-ecr-repo-name.sh <StackName>"

if [[ -z $1 ]]; then
    echo >&2 -e "$USAGE\n\nerror: expected a stack name."
    exit 1
fi

STACK_NAME=$1

REPO_NAME=$(
    aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query "Stacks[0].Outputs[?OutputKey=='ApiServerContainerRepoName'].OutputValue" \
        --output text
)

echo $REPO_NAME
