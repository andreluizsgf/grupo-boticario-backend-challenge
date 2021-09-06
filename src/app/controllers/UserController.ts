import express, { Router } from "express";
import { IUserRepository } from "../../domain/database/repositories/IUserRepository";
import { UserService } from "../services/userService";

export class UserController {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository
    }

    async create (req: express.Request, res: express.Response) {
        const userService = new UserService(this.userRepository);
        const { name, age } = req.body;

        if (!name && !age) {
            return res.status(400).send();
        }

        const user = await userService.create({ name, age });

        return res.send(user).status(201);
    }
}