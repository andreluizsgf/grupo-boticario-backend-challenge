import express from "express";
import { HttpException } from "../../domain/dtos/Error";

export async function errorHandler(error: any, req: any, res: express.Response, next: any) {
    if (error instanceof HttpException) {
        return res.send({error: error.message}).status(error.statusCode);
    }

    console.log(error);

    return res.send({error: "Erro interno."}).status(500)
}