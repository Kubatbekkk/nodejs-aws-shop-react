#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { MyShopAppStack } from "../lib/aws-cdk-stack";

const app = new cdk.App();
new MyShopAppStack(app, "AwsShopCdkStack", {});
