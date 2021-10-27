import { CreateOrderRequest, ListOrdersRequest, ListOrdersResponse } from "../dtos/OrderDto";
import { Dealer } from "../entities/Dealer";
import { Order } from "../entities/Order";

export interface IOrderService {
    create(currentDealer: Dealer, createOrderRequest: CreateOrderRequest): Promise<Order>
    list(currentDealer: Dealer, listOrderRequest: ListOrdersRequest): Promise<ListOrdersResponse>
}