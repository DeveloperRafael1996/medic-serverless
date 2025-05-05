import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
  ScanCommandInput,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Appointment } from "../../domain/entities/Appointment";
import {
  AppointmentDTO,
  AppointmentDynamodb,
} from "../../application/use-cases/RegisterAppointment";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export class DynamoAppointmentRepositoryImpl implements AppointmentDynamodb {
  private client = new DynamoDBClient({});

  async findByInsuredId(insuredId: string): Promise<AppointmentDTO[]> {
    const input: ScanCommandInput = {
      TableName: "Appointment",
      ExpressionAttributeNames: {
        "#ID": "id",
        "#INSUREDID": "insuredId",
        "#STATUS": "status"
      },
      ExpressionAttributeValues: {
        ":insuredId": {
          S: insuredId,
        },
      },
      FilterExpression: "#INSUREDID= :insuredId",
      ProjectionExpression: "#ID, #INSUREDID, #STATUS",
    };

    const command = new ScanCommand(input);
    const result = await this.client.send(command);

    if (result && result.Items && result.Items.length > 0) {
      return result.Items.map((item) => unmarshall(item) as AppointmentDTO);
    }

    return [];
  }

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
