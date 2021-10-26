import express, { NextFunction } from "express";
import { InvalidArgumentException } from "../../domain/dtos/Error";
import { IOrderService } from "../../domain/services/IOrderService";


export default class OrderController {
    private orderService: IOrderService;
    public route: string = "/order";

    constructor(orderService: IOrderService) {
        this.orderService = orderService;
    }

    async create(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const { code, date, dealerCpf, subtotal } = req.body;

            if (!code || !date || !dealerCpf || !subtotal) {
                throw new InvalidArgumentException("Todos os parâmetros devem ser informados.");
            }

            const order = await this.orderService.create({ code, date, dealerCpf, subtotal });

            return res.status(201).send(order);
        } catch (error) {
            next(error)
        }
    }
}