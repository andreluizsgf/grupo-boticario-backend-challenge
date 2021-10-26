import { IOrderRepository } from "../../domain/database/repositories/IOrderRepository";
import NotFoundException, { ConflictException } from "../../domain/dtos/Error";
import { CreateOrderRequest, ListOrdersRequest } from "../../domain/dtos/OrderDto";
import { IOrderService } from "../../domain/services/IOrderService";
import { hash } from "bcrypt";
import OrderValidator from "../../domain/common/validators/OrderValidator";
import { IDealerRepository } from "../../domain/database/repositories/IDealerRepository";

export default class OrderService implements IOrderService {
    private orderRepository: IOrderRepository;
    private dealerRepository: IDealerRepository;
    private orderValidator: OrderValidator;

    constructor(orderRepository: IOrderRepository, dealerRepository: IDealerRepository, orderValidator: OrderValidator) {
        this.orderRepository = orderRepository
        this.dealerRepository = dealerRepository
        this.orderValidator = orderValidator;
    }

    async create(createOrderRequest: CreateOrderRequest) {
        const { code, date, dealerCpf, subtotal } = createOrderRequest

        this.orderValidator.validateOrderRequest({
            code,
            date,
            dealerCpf,
            subtotal
        });

        const existingOrder = await this.orderRepository.findOneBy({
            code
        });

        if (existingOrder) {
            throw new ConflictException("Já existe um pedido com o código informado.")
        }

        const dealer = await this.dealerRepository.findOneBy({
            cpf: dealerCpf
        });

        if (!dealer) {
            throw new NotFoundException("O revendedor informado não existe.");
        }

        const total = await this.orderRepository.getTotalForDealer(dealerCpf);

        return this.orderRepository.insert({ 
            dealerCpf, 
            subtotal, 
            code, 
            date,
            cashbackPercentage: 1,
            cashbackValueInCents: 2,
            status: "Validating"
        });
    }

    // async list(listOrdersRequest: ListOrdersRequest) {
    //     const { pagination, status, since, dealerCpf, until } = listOrdersRequest;
    //     const { currentPage, perPage } = pagination;

    //     return this.orderRepository.paginate(currentPage, perPage, {
    //         status,
    //         dealerCpf,
    //     })
    // }
}
