import { generate } from "gerador-validador-cpf";
import request from "supertest";
import Application from "../../app";
import { generateLaterDate, mockOrderRequest } from "../mocks/order";
import faker from "faker";
import { getValidAccessToken } from "../helpers";
import e from "express";
import { ListOrdersResponse, OrderResponse } from "../../domain/dtos/OrderDto";

let app: e.Express;
const specialCpf = generate();

beforeAll(async () => {
  const application = new Application();
  app = application.app;
  await application.start();
  process.env.SPECIAL_DEALER_CPF = specialCpf;
});

describe("Order", () => {
  describe("Create", () => {
    test.each([
      [generate(), "validating"],
      [specialCpf, "approved"],
    ])("Should create a order.", async (cpf, status) => {
      const { accessToken, mockDealer } = await getValidAccessToken(app, { cpf });
      const mockOrder = mockOrderRequest({ dealerCpf: mockDealer.cpf });
      const createOrderResponse = await request(app)
        .post("/order")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(mockOrder)
        .expect(201);
      const createdOrder = createOrderResponse.body;

      expect(createdOrder).toMatchObject({
        code: mockOrder.code,
        dealerCpf: mockOrder.dealerCpf,
        subtotal: mockOrder.subtotal,
        cashbackPercentage: 10,
        cashbackValueInCents: Math.round((mockOrder.subtotal * 10) / 100),
        status,
      });
    });

    test.each([
      [faker.random.alphaNumeric(11), "O cpf informado é inválido."],
      [generate(), "O cpf informado não condiz com o cpf do usuário antenticado."],
    ])("Should not create a order due to not valid dealer cpf.", async (cpf, errorMessage) => {
      const { accessToken } = await getValidAccessToken(app);
      const mockOrder = mockOrderRequest({ dealerCpf: cpf });
      const createOrderResponse = await request(app)
        .post("/order")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(mockOrder)
        .expect(400);

      expect(JSON.parse(createOrderResponse.text).error).toBe(errorMessage);
    });

    test.each([
      [faker.random.alphaNumeric(11), "Informe uma data no formato correto. YYYY-mm-dd hh:mm:ss"],
      [generateLaterDate(), "A data do pedido deve ser menor que a atual."],
    ])("Should not create a order due to not valid date.", async (date, errorMessage) => {
      const { accessToken, mockDealer } = await getValidAccessToken(app);
      const mockOrder = mockOrderRequest({ date, dealerCpf: mockDealer.cpf });

      const createOrderResponse = await request(app)
        .post("/order")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(mockOrder)
        .expect(400);

      expect(JSON.parse(createOrderResponse.text).error).toBe(errorMessage);
    });

    test("Should not create a order due subtotal less than zero.", async () => {
      const { accessToken, mockDealer } = await getValidAccessToken(app);
      const mockOrder = mockOrderRequest({
        subtotal: -faker.datatype.number(),
        dealerCpf: mockDealer.cpf,
      });
      const createOrderResponse = await request(app)
        .post("/order")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(mockOrder)
        .expect(400);

      expect(JSON.parse(createOrderResponse.text).error).toBe(
        "O valor da compra deve ser maior que 0."
      );
    });
  });

  describe("List", () => {
    test("Should list created orders", async () => {
      const { accessToken, mockDealer } = await getValidAccessToken(app);
      const mockOrder = mockOrderRequest({ dealerCpf: mockDealer.cpf });
      const createOrderResponse = await request(app)
        .post("/order")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(mockOrder)
        .expect(201);

      const createdOrder: OrderResponse = createOrderResponse.body;
      const listOrdersResponse = await request(app)
        .get("/order?currentPage=1&perPage=1")
        .set("Authorization", `Bearer ${accessToken}`);

      const listedOrders: ListOrdersResponse = listOrdersResponse.body;

      expect(listedOrders.data.find((o) => o.id === createdOrder.id)).toBeTruthy();
    });
  });

  test.each([
    [faker.datatype.number(), faker.random.word()],
    [faker.random.word(), faker.datatype.number(250)],
    [faker.datatype.number(0), faker.datatype.number(250)],
    [faker.datatype.number(), faker.datatype.number() + 250],
  ])(
    "Should send invalid argument error when current page or per page are invalid ",
    async (currentPage, perPage) => {
      const { accessToken } = await getValidAccessToken(app);
      const listOrdersResponse = await request(app)
        .get(`/order?currentPage=${currentPage}&perPage=${perPage}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(JSON.parse(listOrdersResponse.text).error).toBe(
        "Os dados de paginação informados são inválidos."
      );
    }
  );

  test("Should send invalid argument error when status is invalid", async () => {
    const { accessToken } = await getValidAccessToken(app);
    const listOrdersResponse = await request(app)
      .get(`/order?currentPage=1&perPage=1&status=${faker.random.word()}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(JSON.parse(listOrdersResponse.text).error).toBe("O status informado não é válido.");
  });
});
