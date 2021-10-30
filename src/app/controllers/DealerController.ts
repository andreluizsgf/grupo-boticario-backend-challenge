import express, { NextFunction } from "express";
import { DealerResponse } from "../../domain/dtos/DealerDto";
import { InvalidArgumentException } from "../../domain/dtos/Error";
import { Dealer } from "../../domain/entities/Dealer";
import { IDealerService } from "../../domain/services/IDealerService";


export default class DealerController {
    private dealerService: IDealerService;
    public route: string = "/dealer";

    constructor(dealerService: IDealerService) {
        this.dealerService = dealerService;
    }

    async create(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const { name, email, cpf, password } = req.body;

            if (!name || !email || !cpf || !password) {
                throw new InvalidArgumentException("Todos os parâmetros devem ser informados.");
            }

            const dealer = await this.dealerService.create({ name, email, cpf, password });

            return res.status(201).send({dealer});
        } catch (error) {
            next(error)
        }
    }

    async getCashback(req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const currentDealer: Dealer = res.locals.currentDealer;
            const cashback = await this.dealerService.getCashback(currentDealer);

            return res.status(200).send({ cashback });
        } catch (error) {
            next(error)
        }
    }
}