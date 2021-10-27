import axios from "axios";

export default class BoticarionApiIntegration {
    private boticarioClient = axios.create({
        baseURL: "https://mdaqk8ek5j.execute-api.us-east-1.amazonaws.com/v1"
    });

    async getCashbackForDealer(dealerCpf: string): Promise<number> {
        const { data, status, statusText } = await this.boticarioClient.get(
            `/cashback?cpf=${dealerCpf}`
        );

        if (status !== 200) {
            throw new Error(`Boticario Integration Error. ${status} : ${statusText}`);
        }

        return data;
    }
}