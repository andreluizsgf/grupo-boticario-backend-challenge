import { Filter, Insert } from "../../../infra/repositories/BaseRepository";
import { CreateOrderRequest } from "../../dtos/OrderDto";
import { Order } from "../../entities/Order";
import { IBaseRepository, PaginationResponse } from "./IBaseRepository";

export interface IOrderRepository extends IBaseRepository<Order> {
    insert (order: Insert<Order>): Promise<Order>
    get(id: string): Promise<Order | undefined>
    findOneBy(order: Filter<Order>): Promise<Order | undefined>
    paginate(currentPage: number, perPage: number, condition: Filter<Order>): Promise<{ data: Order[], pagination: PaginationResponse}>
    getTotalForDealer(dealerCpf: string): Promise<number>
}