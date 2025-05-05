export type Origin = "API_GATEWAY" | "SQS" | "SNS" | "EVENT_BRIDGE";
export type ResponseOrigin = { body: any; source: Origin };

export class DataSourceService {
  public static getBody(event: any): ResponseOrigin {
    // Check if event is from API Gateway
    if (event.body) {
      return {
        body:
          typeof event.body === "string" ? JSON.parse(event.body) : event.body,
        source: "API_GATEWAY",
      };
    }

    // Check if event is from SQS
    if (event.Records && event.Records[0]?.eventSource === "aws:sqs") {
      const body = event.Records[0].body;
      return {
        body: typeof body === "string" ? JSON.parse(body) : body,
        source: "SQS",
      };
    }

    // Check if event is from SNS
    if (event.Records && event.Records[0]?.EventSource === "aws:sns") {
      const message = event.Records[0].Sns.Message;
      return {
        body: typeof message === "string" ? JSON.parse(message) : message,
        source: "SNS",
      };
    }

    // Check if event is from EventBridge
    if (event.detail) {
      return {
        body: event.detail,
        source: "EVENT_BRIDGE",
      };
    }

    throw new Error("Unknown event source or unsupported format");
  }
}
