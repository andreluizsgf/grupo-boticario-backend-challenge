import { Filter, Insert } from "../../../infra/repositories/BaseRepository";
import { CreateOrderRequest } from "../../dtos/OrderDto";
import { Order, OrderStatus } from "../../entities/Order";
import { IBaseRepository, PaginationResponse } from "./IBaseRepository";

export interface IOrderRepository extends IBaseRepository<Order> {
    insert (order: Insert<Order>): Promise<Order>
    get(id: string): Promise<Order | undefined>
    findOneBy(order: Filter<Order>): Promise<Order | undefined>
    paginate(perPage: string, currentPage: string, dealerId: string, status?: OrderStatus): Promise<{ data: Order[], pagination: PaginationResponse}>
    getTotalForDealer(dealerCpf: string): Promise<{value: number}>
}