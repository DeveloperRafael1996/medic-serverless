import { RegisterAppointment } from "../../application/use-cases/RegisterAppointment";
import { DynamoAppointmentRepositoryImpl } from "../../infrastructure/repositories/DynamoAppointmentRepository";
import { SnsPublisherRepositoryImpl } from "../../infrastructure/repositories/SnsPublisherRepository";

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { insuredId, scheduleId, countryISO } = body;
    const topicArn = process.env["SNS_APPOINTMENT"] || "";

    console.log("Event Appointment: ", event);

    const repo = new DynamoAppointmentRepositoryImpl();
    const sns = new SnsPublisherRepositoryImpl();
    const useCase = new RegisterAppointment(repo, sns);

    await useCase.execute({ insuredId, scheduleId, countryISO, topicArn });

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Appointment registered successfully" }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
