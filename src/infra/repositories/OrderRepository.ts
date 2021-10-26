import { IOrderRepository } from "../../domain/database/repositories/IOrderRepository"
import { Order } from "../../domain/entities/Order";
import { knex } from "../knex";
import BaseRepository from "./BaseRepository";

export default class OrderRepository extends BaseRepository<Order> implements IOrderRepository  {
    constructor() {
        super("orders");
    }

    async getTotalForDealer(dealerCpf: string): Promise<number> {
        return (await knex<number>("orders as o")
        .select(knex.raw('COALESCE(SUM("subtotal"), 0)'))
        .where("o.dealer_cpf", dealerCpf)
        .first()) as any;
    }
 }