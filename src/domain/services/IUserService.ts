import { CreateUserRequest } from "../dtos/UserDto";
import { User } from "../entities/User";

export interface IUserService {
    create(createUserRequest: CreateUserRequest): Promise<User>
}

