#!/bin/bash
set -e

USAGE="usage: get-prod-env-letter.sh <StackName>"

if [[ -z $1 ]]; then
    echo >&2 -e "$USAGE\n\nerror: expected a stack name."
    exit 1
fi

STACK_NAME=$1

PROD_ENV_LETTER=$(
    aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query "Stacks[0].Parameters[?ParameterKey=='ProdEnvLetter'].ParameterValue" \
        --output text
)

if [[ "$PROD_ENV_LETTER" == "A" || "$PROD_ENV_LETTER" == "B" ]]; then
    echo $PROD_ENV_LETTER
else
    echo >&2 "Could not read ProdEnvLetter parameter. Got \"$PROD_ENV_LETTER\""
    exit 1
fi
