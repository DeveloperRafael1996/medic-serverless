import { RegisterAppointmentRelational } from "../../application/use-cases/RegisterAppointmentRelational";
import { EventBridgeRepositoryImpl } from "../../infrastructure/repositories/EventBrigdeRepositoryImpl";
import { MysqlAppointmentRepositoryImpl } from "../../infrastructure/repositories/MysqlAppointmentRepository";
import { DataSourceService } from "../../shared/data-source";

export const handler = async (event: any) => {
  const topicArn = process.env["EVENT_BUS_NAME"] || "";
  const { body } = DataSourceService.getBody(event);
  const { insuredId, scheduleId, countryISO } = body;

  const repo = new MysqlAppointmentRepositoryImpl();
  const eventBrigde = new EventBridgeRepositoryImpl();
  const useCase = new RegisterAppointmentRelational(repo, eventBrigde);

  console.log("Body PE", body);

  await useCase.execute({
    insuredId,
    scheduleId,
    countryISO,
    eventBusName: topicArn,
    source: "appointment_pe",
    detailyType: "event_update_appointment",
    detail: body,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Response from appointment-pe",
      input: event,
    }),
  };
};
