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

First package the templates, uploading dependencies to S3 and creating a new template file in `packaged/main.template` referencing the URLs of those artifacts instead of local paths:

```bash
aws --region us-east-1 cloudformation package \
--template-file templates/main.yaml \
--s3-bucket YOUR_CFN_BUCKET_NAME \
--output-template-file packaged/main.template
```

Then deploy the template you just created. Assuming you are creating a new stack, let's set "A" as the production environment, and

```bash
aws --region us-east-1 cloudformation deploy \
--stack-name YOUR_STACK_NAME \
--template-file packaged/main.template \
--capabilities CAPABILITY_NAMED_IAM \
--parameter-overrides DomainName=solarpunkdrifters.com HostedZoneId=YOUR_HOSTED_ZONE_ID ContainerImageUrlA=YOUR_PROD_IMAGE_URL ContainerImageUrlB=YOUR_TEST_IMAGE_URL ProdEnvLetter=A
```

After the initial deploy, you can omit `--parameter-overrides`, but you still need to run `aws cloudformation package` every time you update the stacks.

## Deploy the Website (to testing environment)

Once the CloudFormation stacks are up, you can get the testing website bucket and the testing CloudFront distribution ID from the main stack's outputs (these are named `TestStaticWebsiteS3BucketRoot` and `TestCloudFrontDistributionId` respectively.)

1. Manually build website
   - `cd website && npm run build`
2. Manually upload to S3
   - `aws s3 sync dist/ s3://TEST_WEBSITE_BUCKET --delete`
3. Manually invalidate CloudFront cache
   - `aws cloudfront create-invalidation --distribution-id $TEST_CLOUDFRONT_DIST_ID --paths "/*"`

TODO: make a script do this

## Deploy the API Server (to testing environment)

To release a new version of the API Server in the testing environment, publish a new container to ECR and update the ECS Task Definition to use its URL via the `ContainerImageUrlA` or `ContainerImageUrlB` parameter. Normally, you should only update the container image in the testing environment, check the `ProdEnvLetter` parameter.

1. Manually publish a new verion of your container image to ECR and make note of the URL.
2. Check `ProdEnvLetter` to see which environment (A or B) is production. Pick the opposite letter! Eg if `ProdEnvLetter` is "A", we'll use "B" in the next step.
3. Do `aws cloudfront --stack-name YOUR_STACK_NAME --use-previous-template --parameters ParameterKey=ContainerImageUrlB,ParameterValue=YOUR_NEW_IMAGE_URL` (assuming "B" is the current testing environment. If "A" is currently testing, use the `ContainerImageUrlA` parameter instead).

TODO: make a script do this

# Production vs Testing Environments / Blue-Green Deploy

The CloudFormation stack includes two environments: "A" and "B". One is treated as production and the other as development, and these roles are rotated as part of a blue-green deployment strategy.

The production environment is served by Route53 at `yourdomain.com`

The testing environment is served by Route53 at `testing.yourdomain.com`

To perform a release, "flip" the DNS routes between environments A and B. For example, if the current production environment is "A", we can release "B" as the new production environment with: `aws cloudfront --stack-name YOUR_STACK_NAME --use-previous-template --parameters ParameterKey=ProdEnvLetter,ParameterValue=B`. This will change DNS aliases so the apex domain and `testing` subdomain are flipped. (It will also flip the test vs prod outputs of `main.yaml`)

(If "B" is the current production environment, set `ProdEnvLetter` to `A` instead.)

TODO: a script will do this instead.

# TODO:

- [ ] Make testing subdomain private
- [ ] Make a script that reads the CloudFormation `ProdEnvLetter` parameter and flips A/B instead of manually doing it.
- [ ] Deploy testing container: Make a script which given a container image URL, it reads the CloudFormation `ProdEnvLetter` parameter to find which env is prod, and sets `ContainerImageUrlA` if prod is B or `ContainerImageUrlB` if prod is A
- [ ] The deploy testing container script should have another step in front of it which builds the container and pushes it to ECR, returning a URL to that image.
- [ ] Change bucket delete policy, bc CloudFormation cannot delete a non-empty bucket...
