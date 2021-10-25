import { IDealerRepository } from "../../domain/database/repositories/IDealerRepository";
import { InvalidArgumentException, NotFoundException } from "../../domain/dtos/Error";
import { CreateDealerRequest } from "../../domain/dtos/DealerDto";
import { IDealerService } from "../../domain/services/IDealerService";
import { isEmailValid } from "../../domain/common/validations";

export class DealerService implements IDealerService {
    private dealerRepository: IDealerRepository;

    constructor(dealerRepository: IDealerRepository) {
        this.dealerRepository = dealerRepository
    }

    async create(createDealerRequest: CreateDealerRequest) {
        const { name, cpf, email, password } = createDealerRequest

        ValidateDealer({cpf, email});

        return this.dealerRepository.insert({ name, password, email, cpf });
    }
}

function ValidateDealer(args: {cpf: string, email: string}) {
    const { cpf, email} = args

    if (!isEmailValid(email)) {
        throw new InvalidArgumentException("O email informado é inválido.");
    }
}
