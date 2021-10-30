import { IDealerRepository } from "../../domain/database/repositories/IDealerRepository";
import { ConflictException } from "../../domain/dtos/Error";
import { CreateDealerRequest } from "../../domain/dtos/DealerDto";
import { IDealerService } from "../../domain/services/IDealerService";
import { hash } from "bcrypt";
import DealerValidator from "../../domain/common/validators/DealerValidator";
import BoticarionApiIntegration from "../../infra/integrations/BoticarioApiIntegration";
import { Dealer } from "../../domain/entities/Dealer";
export default class DealerService implements IDealerService {
    private dealerRepository: IDealerRepository;
    private dealerValidator: DealerValidator;
    private boticarioIntegration: BoticarionApiIntegration

    constructor(dealerRepository: IDealerRepository, dealerValidator: DealerValidator, boticarioIntegration: BoticarionApiIntegration) {
        this.dealerValidator = dealerValidator
        this.dealerRepository = dealerRepository
        this.boticarioIntegration = boticarioIntegration
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

        this.dealerValidator.validateDealerRequest({
            cpf,
            email,
            password
        });

        return this.dealerRepository.insert({ name, password: await hash(password, 10), email, cpf });
    }

    async getCashback(currentDealer: Dealer) {
        return (await this.boticarioIntegration.getCashbackCreditForDealer(currentDealer.cpf)).credit;
    }
}
