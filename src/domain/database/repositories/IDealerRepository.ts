import { CreateDealerRequest } from '../../dtos/DealerDto';
import { Dealer } from '../../entities/Dealer';
import { IBaseRepository } from './IBaseRepository';

export interface IDealerRepository extends IBaseRepository<Dealer> {
  insert(dealer: CreateDealerRequest): Promise<Dealer>;
  get(id: string): Promise<Dealer | undefined>;
  findOneBy(dealer: Partial<Dealer>): Promise<Dealer | undefined>;
}
