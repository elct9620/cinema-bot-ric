import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

export class LambdaApiGateway {
  readonly integration: apigwv2.HttpRouteIntegration
  readonly gateway: apigwv2.IHttpApi

  constructor(scope: Construct, id: string, fn: lambda.IFunction) {
    this.integration = new HttpLambdaIntegration(`${id}Integration`, fn);
    this.gateway = new apigwv2.HttpApi(scope, `${id}Api`, {
      defaultIntegration: this.integration
    });
  }
}
