import { CreateOrderRequest } from "../dtos/OrderDto";
import { Order } from "../entities/Order";

export interface IOrderService {
    create(createOrderRequest: CreateOrderRequest): Promise<Order>
    // list(): Promise<Order[]>
}