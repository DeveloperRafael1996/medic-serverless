import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsCommandInput,
} from "@aws-sdk/client-eventbridge";
import { EventBrigdeRepository } from "../../application/use-cases/EventBrigdeRepository";

export class EventBridgeRepositoryImpl implements EventBrigdeRepository {
  private client: EventBridgeClient;

  constructor() {
    this.client = new EventBridgeClient();
  }

  putEvent = async (
    eventBustName: string,
    source: string,
    detailyType: string,
    detail: string
  ) => {
    const input: PutEventsCommandInput = {
      Entries: [
        {
          Source: source,
          DetailType: detailyType,
          Detail: JSON.stringify(detail),
          EventBusName: eventBustName,
        },
      ],
    };

    console.log("Input Event Brigde");
    console.log(input);

    const command = new PutEventsCommand(input);
    await this.client.send(command);
  };
}
