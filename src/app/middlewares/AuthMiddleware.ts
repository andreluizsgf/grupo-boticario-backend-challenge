import express from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { AuthenticationException } from "../../domain/dtos/Error";
import jwt from "jsonwebtoken";
import { IDealerRepository } from "../../domain/database/repositories/IDealerRepository";

export default class AuthMiddleware {
    private dealerRepository: IDealerRepository;

    constructor(dealerRepository: IDealerRepository) {
        this.dealerRepository = dealerRepository
    }

    protected async authenticate(jwtToken: string) {
        try {
            // virar env dps
            const payload: any = jwt.verify(jwtToken, "HS256");

            const dealer = await this.dealerRepository.findOneBy({
                id: payload.dealer.id
            });

            if (!dealer) {
                throw new AuthenticationException('Acesso não autorizado.');
            }

            return dealer;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new AuthenticationException('Token expirado.');
            }

            throw new AuthenticationException('Acesso não autorizado.');
        }
    }

    public async handle(request: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const authHeader = request.headers.authorization;

            if (!authHeader) {
                throw new AuthenticationException('Acesso não autorizado.');
            }

            const jwtToken = authHeader.split('Bearer ')[1];

            res.locals.currentDealer  = await this.authenticate(jwtToken);

            next();
        } catch (error) {
            next(error);
        }
    }
}