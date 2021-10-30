import { generate } from "gerador-validador-cpf";
import request from "supertest";
import Application from "../../app";
import { CreateDealerRequest, DealerResponse } from "../../domain/dtos/DealerDto";
import { mockOrderRequest } from "../unit/mocks/order";
import faker from "faker";
import { Order } from "../../domain/entities/Order";
import { Dealer } from "../../domain/entities/Dealer";
import { mockDealerRequest } from "../unit/mocks/dealer";

const appi = new Application();
const app = appi.app;

beforeAll(async () => {
    await appi.start();
})

describe("Create", () => {
    test("Should create a dealer.", async () => {
        const mockDealer: CreateDealerRequest = mockDealerRequest();
        const createDealerResponse = await request(app).post('/dealer').send(mockDealer).expect(201);
        const createdDealer: Dealer = createDealerResponse.body;

        expect(createdDealer).toMatchObject<DealerResponse>({
            ...a
        });
    })
})