import { Appointment } from "../../domain/entities/Appointment";
import { SnsPublisherRepository } from "./SnsPublisherRepository";

export interface AppointmentDTO {
  id: string;
  insuredId: string;
  scheduleId: number;
  countryISO: string;
  status: string;
}

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;
}
export interface AppointmentDynamodb {
  save(appointment: Appointment): Promise<void>;
  markAsCompleted(id: string): Promise<void>;
  findByInsuredId(insuredId: string): Promise<AppointmentDTO[]>;
}

export class RegisterAppointment {
  constructor(
    private repo: AppointmentDynamodb,
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

  async update(data: { id: string }) {
    await this.repo.markAsCompleted(data.id);
  }
}
