import express, { NextFunction } from "express";
import { InvalidArgumentException } from "../../domain/dtos/Error";
import { IAuthService } from "../../domain/services/IAuthService";

export class AuthController {
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    async login (req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new InvalidArgumentException("Todos os parâmetros devem ser informados.");
            }

            const accessToken = await this.authService.login({ email, password });

            return res.status(200).send({accessToken});
        } catch (error) {
            next(error)
        }
    }
}