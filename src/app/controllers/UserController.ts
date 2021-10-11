import express, { NextFunction } from "express";
import { InvalidArgumentException } from "../../domain/dtos/Error";
import { IUserService } from "../../domain/services/IUserService";

export class UserController {
    private userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
    }

    async create (req: express.Request, res: express.Response, next: NextFunction) {
        try {
            const { name, age } = req.body;

            if (!name || !age) {
                throw new InvalidArgumentException("All paramaters are required.");
            }

            const user = await this.userService.create({ name, age });

            return res.send(user).status(201);

        } catch (error) {
            next(error)
        }
    }

    async get (req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).send('Should send id');
            }

            const user = await this.userService.get(id);

            return res.send(user).status(200);
        } catch (error) {
            next(error);
        }
    }
}