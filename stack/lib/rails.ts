import { Construct } from 'constructs';
import { CfnParameter } from 'aws-cdk-lib'
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

export type RailsEnvironment = { [key: string]: string }
export class Rails extends Construct {
  readonly env: CfnParameter
  readonly key: CfnParameter
  readonly imageName: CfnParameter
  readonly imageTag: CfnParameter
  readonly repository: ecr.IRepository

  private _environment: RailsEnvironment

  constructor(scope: Construct, id: string, environment?: RailsEnvironment) {
    super(scope, id)
    this._environment = environment || {}

    this.env = new CfnParameter(this, "RailsEnv", {
      default: 'production',
      allowedValues: ['production']
    })

    this.key = new CfnParameter(this, "RailsMasterKey", {
      noEcho: true,
      minLength: 1
    })

    this.imageName = new CfnParameter(this, "ImageName")
    this.imageTag = new CfnParameter(this, "IamgeTag", { default: 'main' })

    this.repository = ecr.Repository.fromRepositoryName(this, "RailsRepository", this.imageName.valueAsString)
  }

  get environment(): RailsEnvironment {
    return {
      'RAILS_ENV':	this.env.valueAsString,
      'RAILS_MASTER_KEY':	this.key.valueAsString,
      ...this._environment
    }
  }
}
