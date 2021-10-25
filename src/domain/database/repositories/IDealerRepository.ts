import { CreateDealerRequest } from "../../dtos/DealerDto";
import { Dealer } from "../../entities/Dealer";

export interface IDealerRepository {
    insert (user: CreateDealerRequest): Promise<Dealer>
}