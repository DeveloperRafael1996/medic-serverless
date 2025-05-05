import { FindAppointmentRepository } from "../../application/use-cases/FindAppointmentRepository";
import { DynamoAppointmentRepositoryImpl } from "../../infrastructure/repositories/DynamoAppointmentRepository";

export const handler = async (event: any) => {
  try {
    const insuredId = event.pathParameters?.insuredId;

    const repo = new DynamoAppointmentRepositoryImpl();
    const useCase = new FindAppointmentRepository(repo);
    const results = await useCase.find(insuredId);

    return {
      statusCode: 201,
      body: JSON.stringify({ appointments: results }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
