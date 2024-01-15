# Infrastructure Setup

TODO. Listing manual steps here first, then move this into CI/CD as much as possible.

## Website

1. Register a domain name with a Hosted Zone on Route53
   - Once it's created, copy the Hosted Zone ID
2. Manually deploy `website.yaml`
   - `aws cloudformation deploy --region us-east-1 --stack-name solarpunk-drifters-website --template-file templates/website.yaml --parameter-overrides DomainName=solarpunkdrifters.com HostedZoneId=HOSTEDZONEID12345` (using the Hosted Zone ID from above). This will return the bucket name.
   - NOTE: on subsequent runs, you can omit `--parameter-overrides`. It's only needed for stack creation.
3. Manually build website
   - `cd website && npm run build`
4. Manually upload to S3
   - `aws s3 sync dist/ s3://NAME-OF-WEBSITE-BUCKET --delete`
5. Manually invalidate CloudFront cache
   - `aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths "/*"`
