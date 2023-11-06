import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";

export class MyShopAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a new S3 bucket
    const bucket = new s3.Bucket(this, "MyShopAppBucket", {
      versioned: false,
      bucketName: "rs-cloud-shop-bucket",
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "OAI"
    );
    bucket.grantRead(originAccessIdentity);

    // Create a CloudFront distribution for the S3 bucket
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "MyShopAppDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity,
            },
            behaviors: [{ isDefaultBehavior: true, compress: false }],
          },
        ],
        errorConfigurations: [
          {
            errorCode: 404,
            responsePagePath: "/index.html",
            responseCode: 200,
          },
        ],
      }
    );

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [s3deploy.Source.asset("../nodejs-aws-shop-react/dist")], // Update the directory accordingly
      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/*"],
    });
  }
}
