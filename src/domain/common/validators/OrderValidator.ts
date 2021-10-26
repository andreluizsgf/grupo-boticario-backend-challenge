import { validate } from "gerador-validador-cpf";
import { InvalidArgumentException } from "../../dtos/Error";

export default class OrderValidator {
  validateSubtotal(subtotal: number) {
    if (subtotal < 0) {
      throw new InvalidArgumentException("O valor da compra deve ser maior que 0.");
    }
  }

  validateDate(date: Date) {
    try {
      new Date(date);
    } catch (error) {
      throw new InvalidArgumentException("Informe uma data no formato correto. YYYY-mm-dd hh:mm:ss");
    }

    if (date.getTime() > new Date().getTime()) {
      throw new InvalidArgumentException('A data do pedido deve ser menor que a atual.');
    }
  }

  validateCpf(cpf: string) {
    if (!validate(cpf)) {
      throw new InvalidArgumentException("O cpf informado é inválido.");
    };
  }

  validateOrderRequest(args: {
    dealerCpf: string;
    code: string;
    date: Date;
    subtotal: number;
  }) {
    this.validateCpf(args.dealerCpf);
    this.validateSubtotal(args.subtotal);
    this.validateDate(args.date);
  }
}