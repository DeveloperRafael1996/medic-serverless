export interface SnsPublisherRepository {
  publish(topicArn: string, message: string): Promise<string>;
}
