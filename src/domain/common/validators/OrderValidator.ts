import { isValid } from "date-fns";
import { validate } from "gerador-validador-cpf";
import { InvalidArgumentException } from "../../dtos/Error";
import { Dealer } from "../../entities/Dealer";
import { OrderStatus, ORDER_STATUS } from "../../entities/Order";

export default class OrderValidator {
  validatevalueInCents(valueInCents: number) {
    if (valueInCents < 0) {
      throw new InvalidArgumentException("O valor da compra deve ser maior que 0.");
    }
  }

  validateDate(date: string) {
    if (!isValid(new Date(date))) {
      throw new InvalidArgumentException(
        "Informe uma data no formato correto. YYYY-mm-dd hh:mm:ss"
      );
    }

    if (new Date(date).getTime() > new Date().getTime()) {
      throw new InvalidArgumentException("A data do pedido deve ser menor que a atual.");
    }
  }

  validateCpf(cpf: string, currentDealerCpf: string) {
    if (!validate(cpf)) {
      throw new InvalidArgumentException("O cpf informado é inválido.");
    }

    if (cpf !== currentDealerCpf) {
      throw new InvalidArgumentException(
        "O cpf informado não condiz com o cpf do usuário antenticado."
      );
    }
  }

  validateStatus(status?: string) {
    if (status && !ORDER_STATUS.includes(status as OrderStatus)) {
      throw new InvalidArgumentException("O status informado não é válido.");
    }
  }

  validatePagination(currentPage: number, perPage: number) {
    if (isNaN(currentPage) || isNaN(perPage) || currentPage < 1 || perPage > 250) {
      throw new InvalidArgumentException("Os dados de paginação informados são inválidos.");
    }
  }

  validateOrderRequest(args: {
    dealerCpf: string;
    code: string;
    date: string;
    valueInCents: number;
    currentDealer: Dealer;
  }) {
    this.validateCpf(args.dealerCpf, args.currentDealer.cpf);
    this.validatevalueInCents(args.valueInCents);
    this.validateDate(args.date);
  }

  validateListOrdersRequest(args: { currentPage: number; perPage: number; status?: string }) {
    this.validateStatus(args.status);
    this.validatePagination(args.currentPage, args.perPage);
  }
}
