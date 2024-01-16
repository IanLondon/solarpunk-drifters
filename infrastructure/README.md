# Infrastructure Setup

## CloudFront Routing Notes

CloudFront will route `/api/*` to the Application Load Balancer DNS name, which points to the api-server ECS service. A CloudFront Function `RewriteApiUrisCloudFrontFn` will strip off the `/api` so that the API server itself doesn't have to know that implementation detail. **HOWEVER**, as it's configured, the root URL `/api/` will not work, it will go to the website and 404. It's meant to be implemented so that real API routes are like `/api/v1/something`, so the `/api/` root is never used.

CloudFront will route everything else to the static site in S3. A CloudFront Function `RewriteWebsiteUrisCloudFrontFn` will add `.html` etc so that the routes translate to files in the static site (see fn for details)

# Manual Deploy

TODO. Listing manual steps here first, then move this into CI/CD as much as possible.

## Website

TODO: the API server has to run first, to get `API_ALB_DNS_NAME`. When I refactor this to a nested stack, that parameter should be populated automatically.

1. Register a domain name with a Hosted Zone on Route53
   - Once it's created, copy the Hosted Zone ID
2. Manually deploy `website.yaml`
   - `aws cloudformation deploy --region us-east-1 --stack-name solarpunk-drifters-website --template-file templates/website.yaml --parameter-overrides DomainName=solarpunkdrifters.com HostedZoneId=HOSTEDZONEID12345 ApiLoadBalancerDnsName=API_ALB_DNS_NAME` (using the Hosted Zone ID from above). This will return the bucket name.
   - NOTE: on subsequent runs, you can omit `--parameter-overrides`. It's only needed for stack creation.
3. Manually build website
   - `cd website && npm run build`
4. Manually upload to S3
   - `aws s3 sync dist/ s3://NAME-OF-WEBSITE-BUCKET --delete`
5. Manually invalidate CloudFront cache
   - `aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths "/*"`

## API Server

1. Manually publish a container image to ECR
2. Manually deploy `api-server.yaml`
   - `aws cloudformation deploy --region us-east-1 --stack-name solarpunk-drifters-api-server --template-file templates/api-server.yaml --capabilities CAPABILITY_NAMED_IAM --parameter-overrides ContainerImageUrl=YOUR_IMAGE_URL` (using image URL from above)
   - NOTE: on subsequent runs, you can omit `--parameter-overrides`. It's only needed for stack creation. But you're probably using a new image, so you will probably use it!
