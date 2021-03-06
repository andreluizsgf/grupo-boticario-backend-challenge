import { Dealer } from "../../src/domain/entities/Dealer";
import { generate } from "gerador-validador-cpf";
import { v4 } from "uuid";
import faker from "faker";
import { CreateDealerRequest } from "../../src/domain/dtos/DealerDto";

export function mockDbDealer(partial?: Partial<Dealer>): Dealer {
  return {
    cpf: generate(),
    id: v4(),
    createdAt: new Date(),
    email: faker.internet.email(),
    name: faker.name.firstName(),
    password: faker.internet.password(),
    updatedAt: new Date(),
    ...partial,
  };
}

export function mockDealerRequest(partial?: Partial<CreateDealerRequest>): CreateDealerRequest {
  return {
    cpf: generate(),
    email: faker.internet.email(),
    name: faker.name.firstName(),
    password: faker.internet.password(),
    ...partial,
  };
}
