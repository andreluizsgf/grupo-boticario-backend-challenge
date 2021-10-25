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

            const user = await this.dealerRepository.findOneBy({
                id: payload.dealer.id
            });

            if (!user) {
                throw new Error();
            }

            return user;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new AuthenticationException('Token expired.');
            }

            throw new AuthenticationException('Unauthorized access');
        }
    }

    public async handle(request: express.Request, res: express.Response, next: any) {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new AuthenticationException('Unauthorized access');
        }

        const jwtToken = authHeader.split('Bearer ')[1];

        await this.authenticate(jwtToken);

        await next();
    }
}