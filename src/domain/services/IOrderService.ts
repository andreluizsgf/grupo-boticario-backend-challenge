import { PaginationResult } from "../../infra/repositories/BaseRepository";
import { CreateOrderRequest, ListOrdersRequest } from "../dtos/OrderDto";
import { Dealer } from "../entities/Dealer";
import { Order } from "../entities/Order";

export interface IOrderService {
  create(currentDealer: Dealer, createOrderRequest: CreateOrderRequest): Promise<Order>;
  list(
    currentDealer: Dealer,
    listOrderRequest: ListOrdersRequest
  ): Promise<PaginationResult<Order>>;
}
