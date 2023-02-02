import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Rails } from './rails'
import * as iam from 'aws-cdk-lib/aws-iam';

type RailsImageCode = {
  cmd?: string[]
}
export type RailsFunctionProps = Pick<lambda.DockerImageFunctionProps, "role">  & RailsImageCode

export class RailsFunction extends lambda.DockerImageFunction {
  constructor(scope: Rails, id: string, props?: RailsFunctionProps) {
    super(
      scope,
      id,
      {
        role: props?.role,
        environment: scope.environment,
        code: lambda.DockerImageCode.fromEcr(scope.repository, {
          tagOrDigest: scope.imageTag.valueAsString,
          cmd: props?.cmd
        })
      }
    )
  }
}
