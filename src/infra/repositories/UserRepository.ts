import { IUserRepository } from "../../domain/database/repositories/IUserRepository"
import { User } from "../../domain/entities/User";
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository<User> implements IUserRepository  {
    constructor() {
        super("users");
    }
 }