import express, { NextFunction } from "express";
import { InvalidArgumentException } from "../../domain/dtos/Error";
import { ListOrdersResponse } from "../../domain/dtos/OrderDto";
import { Dealer } from "../../domain/entities/Dealer";
import { IOrderService } from "../../domain/services/IOrderService";

export default class OrderController {
  private orderService: IOrderService;
  public route = "/order";

  constructor(orderService: IOrderService) {
    this.orderService = orderService;
  }

  async create(req: express.Request, res: express.Response, next: NextFunction) {
    try {
      const currentDealer: Dealer = res.locals.currentDealer;
      const { code, date, dealerCpf, valueInCents } = req.body;

      if (!code || !date || !dealerCpf || !valueInCents) {
        throw new InvalidArgumentException("Todos os parâmetros devem ser informados.");
      }

      const order = await this.orderService.create(currentDealer, {
        code,
        date,
        dealerCpf,
        valueInCents,
      });

      return res.status(201).send(order);
    } catch (error) {
      next(error);
    }
  }

  async list(req: express.Request, res: express.Response, next: NextFunction) {
    try {
      const currentDealer: Dealer = res.locals.currentDealer;
      const status = req.query.status as string | undefined;
      const currentPage = req.query.currentPage as number | undefined;
      const perPage = req.query.perPage as number | undefined;

      const listedOrders = await this.orderService.list(currentDealer, {
        status,
        currentPage: currentPage ?? 1,
        perPage: perPage ?? 10,
      });

      const response: ListOrdersResponse = {
        data: listedOrders.data.map((o) => {
          return {
            code: o.code,
            status: o.status,
            valueInCents: o.valueInCents,
            cashbackPercentage: o.cashbackPercentage,
            cashbackValueInCents: o.cashbackValueInCents,
            date: o.date,
          };
        }),
        pagination: listedOrders.pagination,
      };

      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
}
