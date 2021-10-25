import express from "express";
import { HttpException } from "../../domain/dtos/Error";

export async function errorHandler(error: any, req: any, res: express.Response, next: any) {
    if (error instanceof HttpException) {
        console.log(error.statusCode);
        return res.status(error.statusCode).send({error: error.message});
    }

    console.log(error);

    return res.send({error: "Erro interno."}).status(500)
}