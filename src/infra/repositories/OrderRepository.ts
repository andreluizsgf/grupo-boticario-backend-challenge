import { IOrderRepository } from "../../domain/database/repositories/IOrderRepository";
import { Order, OrderStatus } from "../../domain/entities/Order";
import { knex } from "../knex";
import BaseRepository, { PaginationResult } from "./BaseRepository";

export default class OrderRepository extends BaseRepository<Order> implements IOrderRepository {
  constructor() {
    super("orders");
  }

  async getAmountSoldInMonthForDealer(dealerCpf: string): Promise<{ value: number }> {
    return await knex("orders as o")
      .select(knex.raw('COALESCE(SUM("subtotal"), 0) as value'))
      .where("o.dealer_cpf", dealerCpf)
      .andWhereRaw("date_trunc('day', o.date) >= date_trunc('day', now() - interval '1 month')")
      .andWhereRaw("date_trunc('day', o.date) <= date_trunc('day', now())")
      .first();
  }

  async paginate(
    currentPage = 1,
    perPage = 10,
    dealerId: string,
    status: OrderStatus
  ): Promise<PaginationResult<Order>> {
    const query = knex("orders as o").select("*").where("dealer_id", dealerId);

    if (status) {
      query.where("status", status);
    }

    return query.paginate({
      currentPage,
      perPage,
      isLengthAware: true,
    });
  }
}
