import { randomUUID } from "crypto";

export class Appointment {
  public id: string;
  public status: string;

  constructor(
    public insuredId: string,
    public scheduleId: number,
    public countryISO: string
  ) {
    if (!/^[0-9]{5}$/.test(insuredId)) {
      throw new Error("InsuredId debe ser un número de 5 dígitos");
    }

    const validCountries = ["PE", "CL"];
    if (!validCountries.includes(countryISO)) {
      throw new Error("CountryISO debe ser 'PE' o 'CL'");
    }

    this.id = randomUUID();
    this.status = "pending";
  }
}
