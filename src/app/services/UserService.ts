import { IUserRepository } from "../../domain/database/repositories/IUserRepository";
import { NotFoundException } from "../../domain/dtos/Error";
import { CreateUserRequest } from "../../domain/dtos/UserDto";
import { IUserService } from "../../domain/services/IUserService";

export class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository
    }

    async create(createUserRequest: CreateUserRequest) {
        const { name, age } = createUserRequest

        return this.userRepository.insert({ name, age });
    }

    async get(id: string) {
        const user = await this.userRepository.get(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}