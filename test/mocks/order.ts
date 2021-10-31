import { Order, ORDER_STATUS } from "../../src/domain/entities/Order";
import faker from "faker";
import { generate } from "gerador-validador-cpf";
import { CreateOrderRequest } from "../../src/domain/dtos/OrderDto";
import { addDays } from "date-fns";

export function mockDbOrder(partial?: Partial<Order>): Order {
  const valueInCents = faker.datatype.number();
  const cashbackPercentage = faker.datatype.number(20);
  const cashbackValueInCents = Math.round((valueInCents * cashbackPercentage) / 100);

  return {
    id: faker.datatype.uuid(),
    cashbackPercentage,
    code: faker.random.alphaNumeric(3),
    dealerCpf: generate(),
    dealerId: faker.datatype.uuid(),
    status: faker.random.arrayElement(ORDER_STATUS),
    cashbackValueInCents,
    valueInCents,
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...partial,
  };
}

export function mockOrderRequest(partial?: Partial<CreateOrderRequest>): CreateOrderRequest {
  return {
    code: faker.random.alphaNumeric(3),
    dealerCpf: generate(),
    valueInCents: faker.datatype.number(),
    date: new Date().toISOString(),
    ...partial,
  };
}

export function generateLaterDate() {
  return addDays(new Date(), 1).toISOString();
}
