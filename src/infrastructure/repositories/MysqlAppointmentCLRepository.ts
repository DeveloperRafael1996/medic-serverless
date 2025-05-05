import { createConnection } from "mysql2/promise";
import { Appointment } from "../../domain/entities/Appointment";
import { AppointmentRepository } from "../../application/use-cases/RegisterAppointment";

export class MysqlAppointmentCLRepository implements AppointmentRepository {
  private async getConnection() {
    return await createConnection({
      host: process.env.DB_HOST_CL,
      user: process.env.DB_USER_CL,
      password: process.env.DB_PASS_CL,
      database: process.env.DB_NAME_CL,
    });
  }

  async save(appointment: Appointment): Promise<void> {
    const conn = await this.getConnection();

    await conn.execute(
      `INSERT INTO appointments (insuredId, scheduleId, countryISO) VALUES ( ?, ?, ?)`,
      [appointment.insuredId, appointment.scheduleId, appointment.countryISO]
    );

    await conn.end();
  }
}
