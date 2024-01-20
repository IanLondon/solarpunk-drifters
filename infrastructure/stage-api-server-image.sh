#!/bin/bash
set -e

USAGE="usage: stage-api-server-image.sh <StackName> <Tag>"

if [[ -z $1 ]]; then
    echo >&2 -e "$USAGE\n\nerror: expected a stack name."
    exit 1
fi

if [[ -z $2 ]]; then
    echo >&2 -e "$USAGE\n\nerror: expected a tag."
    exit 1
fi

STACK_NAME=$1
TAG=$2

ECR_URI=$(
    aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query "Stacks[0].Outputs[?OutputKey=='ApiServerContainerRepoUri'].OutputValue" \
        --output text
)

IMAGE_URI="$ECR_URI:$TAG"

PROD_ENV_LETTER=$(./get-prod-env-letter.sh "$STACK_NAME")

# TODO: duplicated in rotate-blue-green etc. Make reusable
if [[ "$PROD_ENV_LETTER" == A ]]; then
    TEST_ENV_LETTER="B"
elif [[ "$PROD_ENV_LETTER" == B ]]; then
    TEST_ENV_LETTER="A"
else
    echo >&2 "Could not read ProdEnvLetter parameter"
    exit 1
fi

# Eg "ContainerImageUrlA" or "ContainerImageUrlB"
TEST_CONTAINERIMGURL_PARAM_KEY="ContainerImageUrl$TEST_ENV_LETTER"

PARAMS_LIST=""

# TODO: rotate-blue-green should do this instead of hard-coding parameters... maybe.
# (it would need an alternative way of checking for no changes, I think? TODO.)
for paramkey in $(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Parameters[].ParameterKey" --output text); do
    if [[ $paramkey == $TEST_CONTAINERIMGURL_PARAM_KEY ]]; then
        # set the image uri for the parameter associated with the testing env
        PARAMS_LIST+="ParameterKey=${paramkey},ParameterValue=${IMAGE_URI} " #use the ami from args
    else
        # use prev value for all other params
        PARAMS_LIST+="ParameterKey=${paramkey},UsePreviousValue=true " #else keep using UsePreviousValue=true
    fi
done

aws cloudformation update-stack \
    --stack-name $STACK_NAME \
    --use-previous-template \
    --parameters $PARAMS_LIST
