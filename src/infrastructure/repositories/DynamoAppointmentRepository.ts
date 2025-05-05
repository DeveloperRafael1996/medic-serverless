import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Appointment } from "../../domain/entities/Appointment";
import { AppointmentDynamodb } from "../../application/use-cases/RegisterAppointment";

export class DynamoAppointmentRepositoryImpl implements AppointmentDynamodb {
  private client = new DynamoDBClient({});

  async save(appointment: Appointment): Promise<void> {
    const cmd = new PutItemCommand({
      TableName: "Appointment",
      Item: {
        id: { S: appointment.id },
        insuredId: { S: appointment.insuredId },
        scheduleId: { N: appointment.scheduleId.toString() },
        countryISO: { S: appointment.countryISO },
        status: { S: appointment.status },
        createdAt: { S: new Date().toISOString() },
        updatedAt: { NULL: true },
      },
    });

    await this.client.send(cmd);
  }

  async markAsCompleted(id: string): Promise<void> {
    console.log("Information Appoiment", id);

    const updateCmd = new UpdateItemCommand({
      TableName: "Appointment",
      Key: {
        id: { S: id },
      },
      UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": { S: "completed" },
        ":updatedAt": { S: new Date().toISOString() },
      },
    });

    try {
      const result = await this.client.send(updateCmd);
      console.log("✅ Update :", result);
    } catch (err) {
      console.error(err);
    }
  }
}
