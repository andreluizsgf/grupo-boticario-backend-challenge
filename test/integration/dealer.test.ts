import request from "supertest";
import Application from "../../src/app/app";
import { CreateDealerRequest } from "../../src/domain/dtos/DealerDto";
import { Dealer } from "../../src/domain/entities/Dealer";
import { mockDealerRequest } from "../mocks/dealer";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import faker from "faker";
import { BoticarioResponse } from "../../src/infra/integrations/BoticarioApiIntegration";
import { generate } from "gerador-validador-cpf";
import { getValidAccessToken } from "../helpers";
import e from "express";

const cpf = generate();
let app: e.Express;

beforeAll(async () => {
  process.env.BOTICARIO_API_URL = faker.internet.url();
  mockBoticarioApiIntegration();
  const application = new Application();
  app = application.app;
  await application.start();
});

function mockBoticarioApiIntegration() {
  const mock = new MockAdapter(axios);
  mock.onGet(`${process.env.BOTICARIO_API_URL}/cashback?cpf=${cpf}`).reply<BoticarioResponse>(200, {
    body: {
      credit: faker.datatype.number(),
    },
    statusCode: 200,
  });
}

describe("Create", () => {
  test("Should create a dealer.", async () => {
    const mockDealer: CreateDealerRequest = mockDealerRequest();
    const createDealerResponse = await request(app).post("/dealer").send(mockDealer).expect(201);
    const createdDealer: Dealer = createDealerResponse.body;

    expect(mockDealer).toMatchObject({
      cpf: createdDealer.cpf,
      email: createdDealer.email,
      name: createdDealer.name,
    });
  });

  test.each([
    [{ email: faker.internet.email() }, "email"],
    [{ cpf: generate() }, "cpf"],
  ])("Should not create a dealer if email or cpf is already in use.", async (field, error) => {
    const mockDealer = mockDealerRequest(field);
    await request(app).post("/dealer").send(mockDealer).expect(201);
    const createDealerResponse = await request(app)
      .post("/dealer")
      .send(mockDealerRequest(field))
      .expect(409);

    expect(JSON.parse(createDealerResponse.text).error).toBe(
      `O ${error} informado já está sendo utilizado.`
    );
  });

  test("Should not create a dealer if cpf is not valid.", async () => {
    const mockDealer = mockDealerRequest({ cpf: faker.random.word() });
    const createDealerResponse = await request(app).post("/dealer").send(mockDealer).expect(400);

    expect(JSON.parse(createDealerResponse.text).error).toBe("O cpf informado é inválido.");
  });

  test("Should not create a dealer if email is not valid.", async () => {
    const mockDealer = mockDealerRequest({ email: faker.random.word() });
    const createDealerResponse = await request(app).post("/dealer").send(mockDealer).expect(400);

    expect(JSON.parse(createDealerResponse.text).error).toBe("O email informado é inválido.");
  });

  test("Should not create a dealer if password is not valid.", async () => {
    const mockDealer = mockDealerRequest({
      password: faker.random.alphaNumeric(5),
    });
    const createDealerResponse = await request(app).post("/dealer").send(mockDealer).expect(400);

    expect(JSON.parse(createDealerResponse.text).error).toBe(
      "A senha precisa ter, pelo menos, 6 caracteres."
    );
  });
});

describe("Get Cashback", () => {
  test("Should get cashback.", async () => {
    const { accessToken } = await getValidAccessToken(app, { cpf });

    const getCashbackResponse = await request(app)
      .get("/dealer/cashback")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(getCashbackResponse.body).toBeDefined();
  });
});
