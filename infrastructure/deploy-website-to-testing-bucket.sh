#!/bin/bash
set -e

USAGE="usage: deploy-website-to-testing-bucket.sh <StackName>"

if [[ -z $1 ]]; then
    echo >&2 -e "$USAGE\n\nerror: expected a stack name."
    exit 1
fi

STACK_NAME=$1

PATH_TO_WEBSITE_DIST="$(dirname ${BASH_SOURCE})/../website/dist"

if [[ -z $(ls -A ${PATH_TO_WEBSITE_DIST}) ]]; then
    echo >&2 "No files in website dist/, did it build? Looking in ${PATH_TO_WEBSITE_DIST}"
    exit 1
fi

TEST_BUCKET="s3://$(
    aws cloudformation describe-stacks \
        --stack-name ${STACK_NAME} \
        --query "Stacks[0].Outputs[?OutputKey=='TestStaticWebsiteS3BucketRootName'].OutputValue" \
        --output text
)"

echo "S3: Syncing ${PATH_TO_WEBSITE_DIST} with test website bucket ${TEST_BUCKET}"

aws s3 sync ${PATH_TO_WEBSITE_DIST} ${TEST_BUCKET} --delete
