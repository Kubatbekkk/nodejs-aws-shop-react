import * as cdk from "@aws-cdk/core";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as AwsCdk from "../lib/aws-cdk-stack";

test("SQS Queue and SNS Topic Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new AwsCdk.MyShopAppStack(app, "MyTestStack");
  // THEN
  //@ts-ignore
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::SQS::Queue", {
    VisibilityTimeout: 300,
  });
  template.resourceCountIs("AWS::SNS::Topic", 1);
});
