import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
} from "@aws-sdk/client-sns";
import { SnsPublisherRepository } from "../../application/use-cases/SnsPublisherRepository";

export class SnsPublisherRepositoryImpl implements SnsPublisherRepository {
  private client: SNSClient;

  constructor() {
    this.client = new SNSClient({});
  }

  async publish(topicArn: string, message: string): Promise<string> {
    const input: PublishCommandInput = {
      TargetArn: topicArn,
      Message: message,
    };

    const command = new PublishCommand(input);
    const response = await this.client.send(command);
    return response.MessageId!;
  }
}
