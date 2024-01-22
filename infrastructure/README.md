# Infrastructure Setup

## CloudFront Routing Notes

CloudFront will route `/api/*` to the Application Load Balancer DNS name, which points to the api-server ECS service. A CloudFront Function `RewriteApiUrisCloudFrontFn` will strip off the `/api` so that the API server itself doesn't have to know that implementation detail. **HOWEVER**, as it's configured, the root URL `/api/` will not work, it will go to the website and 404. It's meant to be implemented so that real API routes are like `/api/v1/something`, so the `/api/` root is never used.

CloudFront will route everything else to the static site in S3. A CloudFront Function `RewriteWebsiteUrisCloudFrontFn` will add `.html` etc so that the routes translate to files in the static site (see fn for details)

# Manual Deploy

TODO. Listing manual steps here first, then move this into CI/CD as much as possible.

## Prerequisites

1. Register a domain name with a Hosted Zone on Route53. Once it's created, make note of the Hosted Zone ID, it is required below.
2. The main CloudFormation templates use nested stacks, so we need to have an S3 bucket for `aws cloudformation package` command to upload to. Create it with `aws --region us-east-1 s3 mb s3://YOUR_CFN_BUCKET_NAME`
3. This project uses GitHub Actions for CI/CD. Fork this repo and follow the steps below to configure GitHub Actions.
4. The templates in `./prereqs` are one-time-setup stacks that other resources. (TODO: once this is finished, document it.)

### `./prereqs` templates

#### `github-oidc.yaml`

Sets up required IAM Role and `OIDCProvider` for GitHub OIDC to allow this project's GitHub Actions to access AWS resources. Create this stack with the following command (substitute your own GitHub org/repo/branch if you're doing this on your own fork)

```bash
aws cloudformation create-stack \
   --region YOUR_REGION \
   --stack-name spd-github-oidc \
   --template-body file://./prereqs/github-oidc.yaml \
   --capabilities CAPABILITY_IAM \
   --parameters \
      ParameterKey=GitHubOrg,ParameterValue=IanLondon \
      ParameterKey=GitHubRepo,ParameterValue=solarpunk-drifters \
      ParameterKey=GitHubBranch,ParameterValue=main
```

If you already have an existing GitHub OIDC Provider in your AWS account, include the parameter `ParameterKey=OIDCProviderArn,ParameterValue=YOUR_GH_OIDC_PROVIDER_HERE`. If you don't, omit this parameter, and the template will create it for you.

If you're setting up your own repo, you'll need to pass the GitHub OIDC Role's ARN into GitHub Actions for CI/CD to work. In your browser...

- In AWS Console, in CloudFormation, look at the "Outputs" of this stack. Find the value of `GitHubOIDCRoleArn`. Copy the ARN (it will look something like `arn:aws:iam::123456789:role/spd-github-oidc-GitHubOIDCRole-foOSpaMfOo`).
- Go to your GitHub repo, navigate to `Settings > Secrets & Variables > Variables`. Create a new variable `AWS_GH_OIDC_ROLE`, paste the ARN you copied as the value. Click "Add Variable."
- Create another variable, `AWS_REGION`. Set it to whatever region you're using for the prereqs.

### Finally

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
--parameter-overrides ContainerImageUrlA=YOUR_PROD_IMAGE_URL ContainerImageUrlB=YOUR_TEST_IMAGE_URL DomainName=solarpunkdrifters.com HostedZoneId=YOUR_HOSTED_ZONE_ID ProdEnvLetter=A
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
3. Do `aws cloudformation update-stack --stack-name YOUR_STACK_NAME --use-previous-template --parameters ParameterKey=ContainerImageUrlB,ParameterValue=YOUR_NEW_IMAGE_URL` (assuming "B" is the current testing environment. If "A" is currently testing, use the `ContainerImageUrlA` parameter instead).

TODO: make a script do this

# Production vs Testing Environments / Blue-Green Deploy

The CloudFormation stack includes two environments: "A" and "B". One is treated as production and the other as development, and these roles are rotated as part of a blue-green deployment strategy.

The production environment is served by Route53 at `yourdomain.com`

The testing environment is served by Route53 at `testing.yourdomain.com`

To perform a release, "flip" the DNS routes between environments A and B. For example, if the current production environment is "A", we can release "B" as the new production environment with: `aws cloudformation update-stack --stack-name YOUR_STACK_NAME --use-previous-template --parameters ParameterKey=ProdEnvLetter,ParameterValue=B`. This will change DNS aliases so the apex domain and `testing` subdomain are flipped. (It will also flip the test vs prod outputs of `main.yaml`)

(If "B" is the current production environment, set `ProdEnvLetter` to `A` instead.)

TODO: a script will do this instead.

## More significant infrastructure changes

Since environments A and B reuse the same template files (`website.yaml` and `api-server.yaml`), if you want to make changes you need to refactor strategically. For example, let's say A is active/green and B is latent/blue. Make a `website2.yaml` and use that for the B website stack instead of `website.yaml`, and deploy the updated `main.yaml`, ensuring that no changes were made to the active website stack. Once you're satisfied that B is working, deploy it as described above. Now that B is active, you can switch A over to `website2.yaml` and remove the now-unused `website.yaml`. (Don't take the file versioning literally, this is just a simple example.)
