import express, { NextFunction } from 'express';
import { DealerResponse } from '../../domain/dtos/DealerDto';
import { InvalidArgumentException } from '../../domain/dtos/Error';
import { Dealer } from '../../domain/entities/Dealer';
import { IDealerService } from '../../domain/services/IDealerService';

export default class DealerController {
  private dealerService: IDealerService;
  public route = '/dealer';

  constructor(dealerService: IDealerService) {
    this.dealerService = dealerService;
  }

  async create(req: express.Request, res: express.Response, next: NextFunction) {
    try {
      const { name, email, cpf, password } = req.body;

      if (!name || !email || !cpf || !password) {
        throw new InvalidArgumentException('Todos os parâmetros devem ser informados.');
      }

      const dealer = await this.dealerService.create({
        name,
        email,
        cpf,
        password,
      });

      const response: DealerResponse = {
        cpf: dealer.cpf,
        createdAt: dealer.createdAt,
        email: dealer.email,
        id: dealer.id,
        name: dealer.name,
        updatedAt: dealer.updatedAt,
      };

      return res.status(201).send(response);
    } catch (error) {
      next(error);
    }
  }

  async getCashback(req: express.Request, res: express.Response, next: NextFunction) {
    try {
      const currentDealer: Dealer = res.locals.currentDealer;
      const cashback = await this.dealerService.getCashback(currentDealer);

      return res.status(200).send({ cashback });
    } catch (error) {
      next(error);
    }
  }
}
