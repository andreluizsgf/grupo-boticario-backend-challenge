import axios from "axios";

interface BoticarioBodyResponse {
  credit: number;
}

export interface BoticarioResponse {
  statusCode: number;
  body: BoticarioBodyResponse;
}

export default class BoticarionApiIntegration {
  private boticarioClient = axios.create({
    baseURL: process.env.BOTICARIO_API_URL,
  });

  async getCashbackCreditForDealer(dealerCpf: string): Promise<BoticarioBodyResponse> {
    const { data, status, statusText } = await this.boticarioClient.get<BoticarioResponse>(
      `/cashback?cpf=${dealerCpf}`
    );

    if (status !== 200) {
      throw new Error(`Boticario Integration Error. ${status} : ${statusText}`);
    }

    return data.body;
  }
}
