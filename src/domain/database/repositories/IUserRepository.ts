import { CreateUserRequest } from "../../dtos/UserDto";
import { User } from "../../entities/User";

export interface IUserRepository {
    insert (user: CreateUserRequest): Promise<User>
    get (id: string): Promise<User | undefined>
}