import * as db from "../db";
import { v4 } from 'uuid';
import { CreateUserRequest } from "../../domain/dtos/UserDto";
import { IUserRepository } from "../../domain/database/repositories/IUserRepository"
import { User } from "../../domain/entities/User";

export class UserRepository implements IUserRepository {
    async insert(user: CreateUserRequest): Promise<User> {
        return (await db.query(`INSERT INTO users (id, name, age) VALUES($1, $2, $3) RETURNING *`, [v4(), user.name, user.age])).rows[0];
    }
}