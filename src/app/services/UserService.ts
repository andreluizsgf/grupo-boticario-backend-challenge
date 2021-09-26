import { IUserRepository } from "../../domain/database/repositories/IUserRepository";
import { CreateUserRequest } from "../../domain/dtos/UserDto";
import { User } from "../../domain/entities/User";
import { IUserService } from "../../domain/services/IUserService";

export class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository
    }

    async create(createUserRequest: CreateUserRequest): Promise<User> {
        const { name, age } = createUserRequest

        return this.userRepository.insert({ name, age });
    }
}