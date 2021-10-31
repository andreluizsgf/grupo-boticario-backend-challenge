import request from "supertest";
import Application from "../../src/app/app";
import { CreateDealerRequest } from "../../src/domain/dtos/DealerDto";
import { mockDealerRequest } from "../mocks/dealer";
import faker from "faker";

const application = new Application();
const app = application.app;

beforeAll(async () => {
  await application.start();
});

describe("Auth", () => {
  test("Should authenticate a valid dealer.", async () => {
    const mockDealer: CreateDealerRequest = mockDealerRequest();
    await request(app).post("/dealer").send(mockDealer).expect(201);

    const authResponse = await request(app)
      .post("/auth/login")
      .send({
        email: mockDealer.email,
        password: mockDealer.password,
      })
      .expect(200);

    const { accessToken } = authResponse.body;

    expect(accessToken).toBeDefined();
  });

  test.each([true, false])(
    "Should send not found error when dealer doesnt exist or password is incorrect.",
    async (dealerExists) => {
      const mockDealer: CreateDealerRequest = mockDealerRequest();
      await request(app).post("/dealer").send(mockDealer).expect(201);

      const authResponse = await request(app)
        .post("/auth/login")
        .send({
          email: dealerExists ? mockDealer.email : faker.internet.email(),
          password: faker.internet.password(),
        })
        .expect(404);

      expect(JSON.parse(authResponse.text).error).toBe("Dados de login inválidos.");
    }
  );
});
