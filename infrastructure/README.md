# Infrastructure Setup

## CloudFront Routing Notes

CloudFront will route `/api/*` to the Application Load Balancer DNS name, which points to the api-server ECS service. A CloudFront Function `RewriteApiUrisCloudFrontFn` will strip off the `/api` so that the API server itself doesn't have to know that implementation detail. **HOWEVER**, as it's configured, the root URL `/api/` will not work, it will go to the website and 404. It's meant to be implemented so that real API routes are like `/api/v1/something`, so the `/api/` root is never used.

CloudFront will route everything else to the static site in S3. A CloudFront Function `RewriteWebsiteUrisCloudFrontFn` will add `.html` etc so that the routes translate to files in the static site (see fn for details)

# Manual Deploy

TODO. Listing manual steps here first, then move this into CI/CD as much as possible.

## Prerequisites

1. Register a domain name with a Hosted Zone on Route53. Once it's created, make note of the Hosted Zone ID, it is required below.
2. The CloudFormation template uses nested stacks, so we need to have an S3 bucket for `aws cloudformation package` command to upload to. Create it with `aws --region us-east-1 s3 mb s3://YOUR_CFN_BUCKET_NAME`

After the prerequisites are complete, walk through the following steps to deploy initially deploy stacks/website/api-server. When you want to update any of these projects, it's the same process as for the initial deployment of each (ie, just follow the same steps).

## Deploy/Update CloudFormation nested stacks

### Lint the CloudFormation templates

Install [cfn-lint](https://github.com/aws-cloudformation/cfn-lint), then from this directory root do:

`cfn-lint -i W3002 -t templates/*`

(W3002 is ignored, it's a warning about `TemplateURL` as a local file requiring the `package` cli command, which we're using.)

### Package and Deploy with CloudFormation

First package it, uploading dependencies to S3 and creating a new template file in `packaged/main.template` referencing the URLs of those artifacts instead of local paths:

```bash
aws --region us-east-1 cloudformation package \
--template-file templates/main.yaml \
--s3-bucket YOUR_CFN_BUCKET_NAME \
--s3-prefix YOUR_STACK_NAME
--output-template-file packaged/main.template
```

Then deploy the template you just created:

```bash
aws --region us-east-1 cloudformation deploy \
--stack-name YOUR_STACK_NAME \
--template-file packaged/main.template \
--capabilities CAPABILITY_NAMED_IAM \
--parameter-overrides ContainerImageUrl=YOUR_IMAGE_URL DomainName=solarpunkdrifters.com Environment=YOUR_ENVIRONMENT_NAME HostedZoneId=YOUR_HOSTED_ZONE_ID
```

After the initial deploy, you can omit `--parameter-overrides`, but you still need to run `aws cloudformation package` every time you update the stacks.

## Deploy the Website

Once the CloudFormation stacks are up, you can get the website bucket and the CloudFront distribution ID from the main stack's outputs (these are named `StaticWebsiteS3BucketRoot` and `CloudFrontDistributionId` respectively)

1. Manually build website
   - `cd website && npm run build`
2. Manually upload to S3
   - `aws s3 sync dist/ s3://NAME-OF-WEBSITE-BUCKET --delete`
3. Manually invalidate CloudFront cache
   - `aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths "/*"`

## Deploy the API Server

To release a new version of the API Server, publish a new container to ECR and update the ECS Task Definition to use its URL via the `ContainerImageUrl` parameter on the `ApiServerStack`.

1. Manually publish a new verion of your container image to ECR and make note of the URL.
2. Redeploy the stack following the steps above, with `--parameter-overrides ContainerImageUrl=YOUR_NEW_IMAGE_URL`

# TODO:

Change bucket delete policy, bc CloudFormation cannot delete a non-empty bucket...
