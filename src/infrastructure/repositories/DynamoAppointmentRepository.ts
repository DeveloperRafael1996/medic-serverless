import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
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
}
