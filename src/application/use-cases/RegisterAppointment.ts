import { Appointment } from "../../domain/entities/Appointment";
import { SnsPublisherRepository } from "./SnsPublisherRepository";

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;
}

export class RegisterAppointment {
  constructor(
    private repo: AppointmentRepository,
    private snsPublisher: SnsPublisherRepository
  ) {}

  async execute(data: {
    insuredId: string;
    scheduleId: number;
    countryISO: string;
    topicArn: string;
  }) {
    const appointment = new Appointment(
      data.insuredId,
      data.scheduleId,
      data.countryISO
    );

    await this.repo.save(appointment);
    await this.snsPublisher.publish(data.topicArn, JSON.stringify(appointment));
  }
}
