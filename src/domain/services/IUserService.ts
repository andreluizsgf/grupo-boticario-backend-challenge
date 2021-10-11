import { UserRepository } from "../../infra/repositories/UserRepository";
import { CreateUserRequest } from "../dtos/UserDto";
import { User } from "../entities/User";

export interface IUserService {
    create(createUserRequest: CreateUserRequest): Promise<User>
    get(id: string): Promise<User>
}