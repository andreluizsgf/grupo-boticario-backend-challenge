import { IDealerRepository } from "../../domain/database/repositories/IDealerRepository";
import { ConflictException, InvalidArgumentException, NotFoundException } from "../../domain/dtos/Error";
import { CreateDealerRequest } from "../../domain/dtos/DealerDto";
import { IDealerService } from "../../domain/services/IDealerService";
import { hash } from "bcrypt";
import { DealerValidator } from "../../domain/common/validators/DealerValidator";
export class DealerService implements IDealerService {
    private dealerRepository: IDealerRepository;

    constructor(dealerRepository: IDealerRepository) {
        this.dealerRepository = dealerRepository
    }

    async create(createDealerRequest: CreateDealerRequest) {
        const { name, cpf, email, password } = createDealerRequest

        const existingUserByEmail = await this.dealerRepository.findOneBy({
            email
        });

        if (existingUserByEmail) {
            throw new ConflictException("O email informado já está sendo utilizado.")
        }
        
        const existingUserByCpf = await this.dealerRepository.findOneBy({
            cpf
        });
        
        if (existingUserByCpf) {
            throw new ConflictException("O cpf informado já está sendo utilizado.")
        }

        new DealerValidator().validateDealerRequest({
            cpf,
            email,
            password
        });

        return this.dealerRepository.insert({ name, password: await hash(password, 10), email, cpf });
    }
}
