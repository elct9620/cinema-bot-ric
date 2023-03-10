import { Construct } from 'constructs';
import { Stack, StackProps, CfnParameter } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources'

import { Rails } from './rails'
import { RailsFunction } from './lambda'
import { LambdaApiGateway } from './gateway'


export class CinemaBotStack extends Stack {
  readonly rails: Rails
  readonly queue: sqs.Queue
  readonly apiFn: RailsFunction
  readonly workerFn: RailsFunction
  readonly gateway: LambdaApiGateway

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lineChannelID = new CfnParameter(this, 'LineChannelID')
    const lineChannelToken = new CfnParameter(this, 'LineChannelToken', { noEcho: true })
    const lineChannelSecret = new CfnParameter(this, 'LineChannelSecret', { noEcho: true })

    this.rails = new Rails(this, "CinemaBot", {
      'LINE__CHANNEL_ID': lineChannelID.valueAsString,
      'LINE__CHANNEL_TOKEN': lineChannelToken.valueAsString,
      'LINE__CHANNEL_SECRET': lineChannelSecret.valueAsString
    })
    this.queue = new sqs.Queue(this, "Worker")

    this.apiFn = new RailsFunction(this.rails, "Api")
    this.workerFn = new RailsFunction(this.rails, "Worker", {
      cmd: ['config/environment.Aws::Rails::SqsActiveJob.lambda_job_handler']
    })

    this.gateway = new LambdaApiGateway(this, "Rails", this.apiFn)

    this.grantAccess()
    this.attachWorker()
  }

  private grantAccess() {
    this.queue.grantSendMessages(this.apiFn)
    this.queue.grantSendMessages(this.workerFn)
    this.queue.grantConsumeMessages(this.workerFn)
  }

  private attachWorker() {
    this.workerFn.addEventSource(new SqsEventSource(this.queue))

    this.apiFn.addEnvironment('SQS_URL', this.queue.queueUrl)
    this.workerFn.addEnvironment('SQS_URL', this.queue.queueUrl)
  }
}
