import { CreateDealerRequest } from "../dtos/DealerDto";
import { Dealer } from "../entities/Dealer";

export interface IDealerService {
  create(createDealerRequest: CreateDealerRequest): Promise<Dealer>;
  getCashback(currentDealer: Dealer): Promise<number>;
}
