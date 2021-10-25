import express, { NextFunction } from "express";
import { InvalidArgumentException } from "../../domain/dtos/Error";
import { IDealerService } from "../../domain/services/IDealerService";

export class DealerController {
    private dealerService: IDealerService;

    constructor(dealerService: IDealerService) {
        this.dealerService = dealerService;
    }

    async create (req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const { name, email, cpf, password } = req.body;

            if (!name || !email || !cpf || !password) {
                throw new InvalidArgumentException("Todos os parâmetros devem ser informados.");
            }

            const dealer = await this.dealerService.create({ name, email, cpf, password });

            return res.status(201).send(dealer);
        } catch (error) {
            next(error)
        }
    }
}