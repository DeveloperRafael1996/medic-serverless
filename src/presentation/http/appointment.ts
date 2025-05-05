import { RegisterAppointment } from "../../application/use-cases/RegisterAppointment";
import { DynamoAppointmentRepositoryImpl } from "../../infrastructure/repositories/DynamoAppointmentRepository";
import { SnsPublisherRepositoryImpl } from "../../infrastructure/repositories/SnsPublisherRepository";
import { DataSourceService } from "../../shared/data-source";

export const handler = async (event: any) => {
  try {
    const repo = new DynamoAppointmentRepositoryImpl();
    const sns = new SnsPublisherRepositoryImpl();
    const useCase = new RegisterAppointment(repo, sns);

    const { body: datasource, source } = DataSourceService.getBody(event);

    if (source === "SQS") {
      console.log("Data SQS", datasource);
      console.log("Source", source);

      const countryISO = datasource.detail?.countryISO;
      const insuredId = datasource.detail?.insuredId;

      console.log("CountryISO:", countryISO);
      console.log("InsuredId:", insuredId);

      await useCase.update({ id: datasource.detail?.id });

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: "Appointment updated successfully SQS",
        }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { insuredId, scheduleId, countryISO } = body;
    const topicArn = process.env["SNS_APPOINTMENT"] || "";

    console.log("Event Appointment: ", event);

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
