import { IDealerRepository } from '../../domain/database/repositories/IDealerRepository';
import { LoginRequest } from '../../domain/dtos/AuthDto';
import { IAuthService } from '../../domain/services/IAuthService';
import { compare } from 'bcrypt';
import NotFoundException from '../../domain/dtos/Error';
import jwt from 'jsonwebtoken';

export default class AuthService implements IAuthService {
    private dealerRepository: IDealerRepository;

    constructor(dealerRepository: IDealerRepository) {
        this.dealerRepository = dealerRepository;
    }

    async login(loginRequest: LoginRequest) {
        const { email, password } = loginRequest;

        const dealer = await this.dealerRepository.findOneBy({
            email
        });

        if (!dealer || !(await compare(password, dealer.password))) {
            throw new NotFoundException('Dados de login inválidos.');
        }

        return jwt.sign({ dealer: dealer }, 'HS256', { expiresIn: '7d' });
    }
}
