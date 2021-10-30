import { Filter, Insert, PaginationResult } from "../../../infra/repositories/BaseRepository";
import { Order, OrderStatus } from "../../entities/Order";
import { IBaseRepository } from "./IBaseRepository";

export interface IOrderRepository extends IBaseRepository<Order> {
  insert(order: Insert<Order>): Promise<Order>;
  get(id: string): Promise<Order | undefined>;
  findOneBy(order: Filter<Order>): Promise<Order | undefined>;
  paginate(
    perPage: number,
    currentPage: number,
    dealerId: string,
    status?: OrderStatus
  ): Promise<PaginationResult<Order>>;
  getTotalForDealer(dealerCpf: string): Promise<{ value: number }>;
}
