import { Appointment } from "../../domain/entities/Appointment";
import { EventBrigdeRepository } from "./EventBrigdeRepository";
import { AppointmentRepository } from "./RegisterAppointment";

export class RegisterAppointmentRelational {
  constructor(
    private repo: AppointmentRepository,
    private eventBrigde: EventBrigdeRepository
  ) {}

  async execute(data: {
    insuredId: string;
    scheduleId: number;
    countryISO: string;
    eventBusName: string;
    source: string;
    detailyType: string;
    detail: string;
  }) {
    const appointment = new Appointment(
      data.insuredId,
      data.scheduleId,
      data.countryISO
    );

    console.log("📦 Data:", JSON.stringify(data, null, 2));

    console.log("RDS MYSQL");
    console.log(appointment);

    await this.repo.save(appointment);
    await this.eventBrigde.putEvent(
      data.eventBusName,
      data.source,
      data.detailyType,
      data.detail
    );
  }
}
