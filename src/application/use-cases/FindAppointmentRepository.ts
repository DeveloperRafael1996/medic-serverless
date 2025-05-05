import { AppointmentDTO, AppointmentDynamodb } from "./RegisterAppointment";

export class FindAppointmentRepository {
  constructor(private repo: AppointmentDynamodb) {}

  async find(insuredId: string): Promise<AppointmentDTO[]> {
    return this.repo.findByInsuredId(insuredId);
  }
}
