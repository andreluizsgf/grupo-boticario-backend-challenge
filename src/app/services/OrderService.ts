import { IOrderRepository } from "../../domain/database/repositories/IOrderRepository";
import NotFoundException, { ConflictException } from "../../domain/dtos/Error";
import { CreateOrderRequest, ListOrdersRequest } from "../../domain/dtos/OrderDto";
import { IOrderService } from "../../domain/services/IOrderService";
import OrderValidator from "../../domain/common/validators/OrderValidator";
import { IDealerRepository } from "../../domain/database/repositories/IDealerRepository";
import { Dealer } from "../../domain/entities/Dealer";
import { OrderStatus } from "../../domain/entities/Order";
import { formatCpf, formatPercentageValue } from "../../domain/common/formatters";

export default class OrderService implements IOrderService {
  private orderRepository: IOrderRepository;
  private dealerRepository: IDealerRepository;
  private orderValidator: OrderValidator;

  constructor(
    orderRepository: IOrderRepository,
    dealerRepository: IDealerRepository,
    orderValidator: OrderValidator
  ) {
    this.orderRepository = orderRepository;
    this.dealerRepository = dealerRepository;
    this.orderValidator = orderValidator;
  }

  async create(currentDealer: Dealer, createOrderRequest: CreateOrderRequest) {
    const { code, date, dealerCpf, valueInCents } = createOrderRequest;
    const cleanedCpf = formatCpf(dealerCpf);

    this.orderValidator.validateOrderRequest({
      code,
      date,
      dealerCpf: cleanedCpf,
      valueInCents,
      currentDealer,
    });

    const existingOrder = await this.orderRepository.findOneBy({
      code,
    });

    if (existingOrder) {
      throw new ConflictException("Já existe um pedido com o código informado.");
    }

    const dealer = await this.dealerRepository.findOneBy({
      cpf: cleanedCpf,
    });

    if (!dealer) {
      throw new NotFoundException("O revendedor informado não existe.");
    }

    const { value } = await this.orderRepository.getAmountSoldInMonthForDealer(currentDealer.cpf);

    const cashbackPercentage = this.getCashbackPercentage(valueInCents);

    return this.orderRepository.insert({
      dealerCpf: cleanedCpf,
      valueInCents,
      code,
      date: new Date(date),
      dealerId: dealer.id,
      cashbackPercentage,
      cashbackValueInCents: formatPercentageValue(value * cashbackPercentage),
      status: cleanedCpf === process.env.SPECIAL_DEALER_CPF ? "approved" : "validating",
    });
  }

  async list(currentDealer: Dealer, listOrdersRequest: ListOrdersRequest) {
    const { perPage, currentPage, status } = listOrdersRequest;

    this.orderValidator.validateListOrdersRequest({
      currentPage,
      perPage,
      status,
    });

    return this.orderRepository.paginate(
      currentPage,
      perPage,
      currentDealer.id,
      status as OrderStatus
    );
  }

  getCashbackPercentage(orderValue: number) {
    switch (true) {
      case orderValue <= 100000:
        return 10;
      case orderValue <= 150000:
        return 15;
      default:
        return 20;
    }
  }
}
