import express from "express";
import { IUserService } from "../../domain/services/IUserService";
import { UserService } from "../services/UserService";

export class UserController {
    private userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
    }

    async create (req: express.Request, res: express.Response) {
        const { name, age } = req.body;

        if (!name && !age) {
            return res.status(400).send();
        }

        const user = await this.userService.create({ name, age });

        return res.send(user).status(201);
    }
}