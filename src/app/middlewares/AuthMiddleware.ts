import express from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { AuthenticationException, InternalErrorException } from "../../domain/dtos/Error";
import jwt from "jsonwebtoken";
import { IDealerRepository } from "../../domain/database/repositories/IDealerRepository";

export default class AuthMiddleware {
    private dealerRepository: IDealerRepository;

    constructor(dealerRepository: IDealerRepository) {
        this.dealerRepository = dealerRepository
    }

    protected async authenticate(jwtToken: string) {
        try {
            if (!process.env.JWT_SECRET) {
                console.log("As variável JWT_SECRET não foi definida");
                throw new InternalErrorException("Erro interno");
            }

            const payload: any = jwt.verify(jwtToken, process.env.JWT_SECRET);

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
                throw new AuthenticationException('É necessário informar um token de autenticação.');
            }

            const jwtToken = authHeader.split('Bearer ')[1];

            res.locals.currentDealer  = await this.authenticate(jwtToken);

            next();
        } catch (error) {
            next(error);
        }
    }
}