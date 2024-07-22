# Thumbnail creator - serverless

## Description

This application is used to create a thumbnail from original photo. It leverages AWS serverless services: API Gateway, Lambda Function, S3 Bucket, DynamoDB and SNS Topic. Template file is built using the AWS Application Composer.

## Installation

```bash
npm install
```

## Build and Deployment

Possible solution is to use SAM (Serverless Application Model) for build and deployment.

```bash
sam build
```

```bash
npm deploy --guided
```

Parameter --guilded should only be used for the first deployment where we need to provide additional settings.

## Testing the app

Adjust and open upload-image.html to be able to upload the photo.
