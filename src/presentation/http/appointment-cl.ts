import { RegisterAppointmentRelational } from "../../application/use-cases/RegisterAppointmentRelational";
import { MysqlAppointmentCLRepository } from "../../infrastructure/repositories/MysqlAppointmentCLRepository";
import { DataSourceService } from "../../shared/data-source";
import { EventBridgeRepositoryImpl } from "../../infrastructure/repositories/EventBrigdeRepositoryImpl";

export const handler = async (event: any) => {
  const topicArn = process.env["EVENT_BUS_NAME"] || "";

  console.log("Event Appoinment", event);

  const { body } = DataSourceService.getBody(event);
  const { insuredId, scheduleId, countryISO } = body;

  const repo = new MysqlAppointmentCLRepository();
  const eventBrigde = new EventBridgeRepositoryImpl();

  const useCase = new RegisterAppointmentRelational(repo, eventBrigde);

  console.log("Body CL", body);
  await useCase.execute({
    insuredId,
    scheduleId,
    countryISO,
    eventBusName: topicArn,
    source: "appointment_cl",
    detailyType: "event_update_appointment",
    detail: body,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Response from appointment-cl",
      input: event,
    }),
  };
};
