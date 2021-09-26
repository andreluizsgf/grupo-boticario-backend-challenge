import * as db from "../db";
import { v4 } from 'uuid';
import { CreateUserRequest } from "../../domain/dtos/UserDto";
import { IUserRepository } from "../../domain/database/repositories/IUserRepository"
import { User } from "../../domain/entities/User";
import { knex } from "../db";
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository<User> implements IUserRepository  {
    constructor() {
        super("users");
    }
 }