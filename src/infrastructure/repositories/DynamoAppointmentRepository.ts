import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Appointment } from "../../domain/entities/Appointment";
import { AppointmentRepository } from "../../application/use-cases/RegisterAppointment";

export class DynamoAppointmentRepositoryImpl implements AppointmentRepository {
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
    console.log("Id", id);

    const getCmd = new GetItemCommand({
      TableName: "Appointment",
      Key: {
        id: { S: id },
      },
    });

    const result = await this.client.send(getCmd);

    console.log("Get Appoiment");
    console.log(result.Item);

    if (!result.Item) {
      throw new Error(`Appointment With Id ${id} Not Found`);
    }

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

    await this.client.send(updateCmd);
  }
}
