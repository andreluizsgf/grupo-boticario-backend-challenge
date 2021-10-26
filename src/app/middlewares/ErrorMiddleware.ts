import express from "express";
import { HttpException } from "../../domain/dtos/Error";

export default class ErrorMiddleware {
    async handle(error: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        if (error instanceof HttpException) {
            console.log(error.statusCode);
            return res.status(error.statusCode).send({error: error.message});
        }

        console.log(error);

        return res.send({error: "Erro interno."}).status(500)
    }
}