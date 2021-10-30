import express, { NextFunction } from "express";
import { InvalidArgumentException } from "../../domain/dtos/Error";
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
      const { code, date, dealerCpf, subtotal } = req.body;

      if (!code || !date || !dealerCpf || !subtotal) {
        throw new InvalidArgumentException("Todos os parâmetros devem ser informados.");
      }

      const order = await this.orderService.create(currentDealer, {
        code,
        date,
        dealerCpf,
        subtotal,
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

      const orders = await this.orderService.list(currentDealer, {
        status,
        currentPage: currentPage ?? 1,
        perPage: perPage ?? 10,
      });

      return res.status(200).send(orders);
    } catch (error) {
      next(error);
    }
  }
}
