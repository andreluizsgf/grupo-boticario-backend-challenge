import DealerService from "../../src/app/services/DealerService";
import DealerValidator from "../../src/domain/common/validators/DealerValidator";
import BoticarionApiIntegration from "../../src/infra/integrations/BoticarioApiIntegration";
import DealerRepository from "../../src/infra/repositories/DealerRepository";
import sinon from "sinon";
import { mockDbDealer, mockDealerRequest } from "../mocks/dealer";
import { ConflictException } from "../../src/domain/dtos/Error";
import Sinon from "sinon";
import faker from "faker";

const sandbox: Sinon.SinonSandbox = sinon.createSandbox();

const dealerRepository = new DealerRepository();
const dealerValidator = new DealerValidator();
const boticarionIntegration = new BoticarionApiIntegration();
const dealerService = new DealerService(dealerRepository, dealerValidator, boticarionIntegration);

beforeEach(() => {
  sandbox.restore();
});

describe("Dealer Service", () => {
  describe("create", () => {
    test("Should create a dealer.", async () => {
      const mockDealer = mockDealerRequest();
      const dbDealer = mockDbDealer(mockDealer);

      sandbox.stub(DealerRepository.prototype, "insert").returns(Promise.resolve(dbDealer));
      sandbox.stub(DealerRepository.prototype, "findOneBy").returns(Promise.resolve(undefined));

      const createdDealer = await dealerService.create(mockDealer);

      expect(createdDealer).toMatchObject(dbDealer);
    });

    test("Should throw error when email is already in use.", async () => {
      const mockDealer = mockDealerRequest();
      const dbDealer = mockDbDealer({
        email: mockDealer.email,
      });

      sandbox.stub(DealerRepository.prototype, "findOneBy").returns(Promise.resolve(dbDealer));

      const act = dealerService.create(mockDealer);

      expect(act).rejects.toThrowError("O email informado já está sendo utilizado.");
      expect(act).rejects.toBeInstanceOf(ConflictException);
    });

    test("Should throw error when cpf is already in use.", async () => {
      const mockDealer = mockDealerRequest();
      const dbDealer = mockDbDealer({
        cpf: mockDealer.cpf,
      });

      sandbox
        .stub(DealerRepository.prototype, "findOneBy")
        .withArgs({
          cpf: mockDealer.cpf,
        })
        .returns(Promise.resolve(dbDealer));

      const act = dealerService.create(mockDealer);

      expect(act).rejects.toThrowError("O cpf informado já está sendo utilizado.");
      expect(act).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe("getCashbackCredit", () => {
    test("Should get cashback credit for dealer.", async () => {
      const expectedCashbackCredit = faker.datatype.number();

      sandbox.stub(BoticarionApiIntegration.prototype, "getCashbackCreditForDealer").returns(
        Promise.resolve({
          credit: expectedCashbackCredit,
        })
      );

      const cashbackCreditInCents = await dealerService.getCashback(mockDbDealer());

      expect(cashbackCreditInCents).toBe(expectedCashbackCredit * 100);
    });
  });
});
