import OrderService from "../../src/app/services/OrderService";
import OrderValidator from "../../src/domain/common/validators/OrderValidator";
import OrderRepository from "../../src/infra/repositories/OrderRepository";
import sinon from "sinon";
import { mockDbOrder, mockOrderRequest } from "../mocks/order";
import NotFoundException, { ConflictException } from "../../src/domain/dtos/Error";
import Sinon from "sinon";
import faker from "faker";
import DealerRepository from "../../src/infra/repositories/DealerRepository";
import { mockDbDealer } from "../mocks/dealer";

const sandbox: Sinon.SinonSandbox = sinon.createSandbox();

const orderRepository = new OrderRepository();
const dealerRepository = new DealerRepository();
const orderValidator = new OrderValidator();
const orderService = new OrderService(orderRepository, dealerRepository, orderValidator);

beforeEach(() => {
  sandbox.restore();
});

describe("Order Service", () => {
  describe("create", () => {
    test("Should create a order", async () => {
      const mockOrder = mockOrderRequest();
      const dbOrder = mockDbOrder({
        ...mockOrder,
        date: new Date(mockOrder.date),
      });
      const dbDealer = mockDbDealer({ cpf: mockOrder.dealerCpf });

      sandbox.stub(OrderRepository.prototype, "insert").returns(Promise.resolve(dbOrder));
      sandbox.stub(OrderRepository.prototype, "getAmountSoldInMonthForDealer").returns(
        Promise.resolve({
          value: mockOrder.valueInCents,
        })
      );
      sandbox.stub(DealerRepository.prototype, "findOneBy").returns(Promise.resolve(dbDealer));
      sandbox.stub(OrderRepository.prototype, "findOneBy").returns(Promise.resolve(undefined));

      const createdOrder = await orderService.create(dbDealer, mockOrder);

      expect(createdOrder).toMatchObject(dbOrder);
    });

    test("Should throw error when code is already used.", async () => {
      const mockOrder = mockOrderRequest();
      const dbDealer = mockDbDealer({ cpf: mockOrder.dealerCpf });

      sandbox
        .stub(OrderRepository.prototype, "findOneBy")
        .withArgs({ code: mockOrder.code })
        .returns(Promise.resolve(mockDbOrder()));

      const act = orderService.create(dbDealer, mockOrder);

      expect(act).rejects.toThrowError("Já existe um pedido com o código informado.");
      expect(act).rejects.toBeInstanceOf(ConflictException);
    });

    test("Should throw error when dealer cpf does not exist.", async () => {
      const mockOrder = mockOrderRequest();
      const dbDealer = mockDbDealer({ cpf: mockOrder.dealerCpf });

      sandbox.stub(OrderRepository.prototype, "findOneBy").returns(Promise.resolve(undefined));
      sandbox.stub(DealerRepository.prototype, "findOneBy").returns(Promise.resolve(undefined));
      sandbox.stub(OrderRepository.prototype, "getAmountSoldInMonthForDealer").returns(
        Promise.resolve({
          value: mockOrder.valueInCents,
        })
      );

      const act = orderService.create(dbDealer, mockOrder);

      expect(act).rejects.toThrowError("O revendedor informado não existe.");
      expect(act).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("list", () => {
    test("Should list all created orders for dealer", async () => {
      const dbDealer = mockDbDealer();
      const dbOrder = mockDbOrder();
      const currentPage = 1;
      const perPage = 1;

      sandbox.stub(OrderRepository.prototype, "paginate").returns(
        Promise.resolve({
          data: [dbOrder],
          pagination: {
            currentPage,
            perPage,
            lastPage: 1,
            total: 1,
          },
        })
      );

      const listedOrders = await orderService.list(dbDealer, {
        perPage: 1,
        currentPage: 1,
      });

      expect(listedOrders.data).toContainEqual(dbOrder);
      expect(listedOrders.pagination).toMatchObject({
        currentPage,
        perPage,
        lastPage: 1,
        total: 1,
      });
    });
  });

  describe("getCashbackPercentage", () => {
    test("Should get correct cashback percentage.", () => {
      const orderValueAccumulated = faker.datatype.number();
      const cashbackPercentage = orderService.getCashbackPercentage(orderValueAccumulated);

      if (orderValueAccumulated <= 100000) {
        expect(cashbackPercentage).toBe(10);
      } else if (orderValueAccumulated <= 150000) {
        expect(cashbackPercentage).toBe(15);
      } else {
        expect(cashbackPercentage).toBe(20);
      }
    });
  });
});
