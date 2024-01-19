#!/bin/bash
set -e

USAGE="usage: rotate-blue-green.sh <StackName> <path/to/template/file>"

# TODO: generate in a loop?
NO_CHANGE_PARAMETERS="\
ParameterKey=ProdEnvLetter,UsePreviousValue=true \
ParameterKey=DomainName,UsePreviousValue=true \
ParameterKey=HostedZoneId,UsePreviousValue=true \
ParameterKey=ContainerImageUrlA,UsePreviousValue=true \
ParameterKey=ContainerImageUrlB,UsePreviousValue=true"

if [[ -z $1 ]]; then
    echo >&2 -e "$USAGE\n\nerror: expected a stack name."
    exit 1
fi

if [[ -z $2 ]]; then
    echo >&2 -e "$USAGE\n\nerror: expected a template file."
    exit 1
fi

STACK_NAME=$1
TEMPLATE_FILE=$2

PROD_ENV_LETTER=$(
    aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query "Stacks[0].Parameters[?ParameterKey=='ProdEnvLetter'].ParameterValue" \
        --output text
)

if [[ "$PROD_ENV_LETTER" == A ]]; then
    TEST_ENV_LETTER="B"
elif [[ "$PROD_ENV_LETTER" == B ]]; then
    TEST_ENV_LETTER="A"
else
    echo >&2 "Could not read ProdEnvLetter parameter"
    exit 1
fi

# Check for pending changes with a temporary change set
CHANGE_SET_NAME=rotate-blue-green-changeset-$RANDOM

echo "creating change set $CHANGE_SET_NAME"

CHANGE_SET_ARN=$(
    aws cloudformation create-change-set \
        --stack-name $STACK_NAME \
        --template-body file://$TEMPLATE_FILE \
        --change-set-name $CHANGE_SET_NAME \
        --include-nested-stacks \
        --parameters $NO_CHANGE_PARAMETERS \
        --query "Id" \
        --output text
)

echo "Waiting for change set to fail, polling its Status..."

for i in {1..12}; do
    if [[ i -eq 12 ]]; then
        echo >&2 "error: Timed out waiting for change set to resolve its status."
        echo >&2 "Make sure to delete the change set manually. ($CHANGE_SET_ARN)"
        exit 1
    fi

    sleep 5

    CHANGE_SET_STATUS=$(
        aws cloudformation describe-change-set \
            --change-set-name $CHANGE_SET_ARN \
            --query "Status" \
            --output text
    )

    if [[ "$CHANGE_SET_STATUS" == "FAILED" ]]; then
        # we expect it to fail because there are no changes.
        break
    elif [[ "$CHANGE_SET_STATUS" != "CREATE_IN_PROGRESS" ]]; then
        echo >&2 "error: Unexpected change set status $CHANGE_SET_STATUS. We expected it to reach FAILED if there were no changes"
        echo >&2 "Attempting to delete the change set..."
        aws cloudformation delete-change-set --change-set-name $CHANGE_SET_ARN
        exit 1
    fi
done

# All we know is the change set "FAILED", we need to confirm that it failed
# bc there were no changes in the change set.
CHANGES=$(
    aws cloudformation describe-change-set \
        --change-set-name $CHANGE_SET_ARN \
        --query "Changes" \
        --output json
)

echo "deleting change set. changes were: $CHANGES (should be [])"

aws cloudformation delete-change-set --change-set-name $CHANGE_SET_ARN

if [[ "$CHANGES" == "[]" ]]; then
    echo "No changes, all good."
else
    echo >&2 "error: Changes detected! Deploy the template file before rotating environments."
    exit 1
fi

# No changes, we're in the clear!
echo "Prod is $PROD_ENV_LETTER and test is $TEST_ENV_LETTER."
echo "Setting ProdEnvLetter to $TEST_ENV_LETTER..."

aws cloudformation deploy --stack-name $STACK_NAME \
    --template-file $TEMPLATE_FILE \
    --capabilities CAPABILITY_NAMED_IAM \
    --parameter-overrides ProdEnvLetter=$TEST_ENV_LETTER

echo "Done."
