import faker from "faker";
import OrderValidator from "../../src/domain/common/validators/OrderValidator";
import { generate } from "gerador-validador-cpf";
import { ORDER_STATUS } from "../../src/domain/entities/Order";
import { generateLaterDate } from "../mocks/order";

const orderValidator = new OrderValidator();

describe("Order Validator", () => {
  describe("cpf", () => {
    test("Should return an access token when login succeed", async () => {
      const cpf = generate();
      expect(orderValidator.validateCpf(cpf, cpf)).toBe(undefined);
    });

    test("Should throw error if dealer cpf and given cpf are not same.", async () => {
      try {
        orderValidator.validateCpf(generate(), generate());
      } catch (error) {
        expect(error.message).toBe("O cpf informado não condiz com o cpf do usuário antenticado.");
      }
    });

    test("Should throw error if given cpf is not a cpf.", async () => {
      try {
        orderValidator.validateCpf(faker.random.alphaNumeric(11), generate());
      } catch (error) {
        expect(error.message).toBe("O cpf informado é inválido.");
      }
    });
  });

  describe("date", () => {
    test("Should not throw error when date is valid.", async () => {
      expect(orderValidator.validateDate(new Date().toISOString())).toBe(undefined);
    });

    test("Should throw error if date is in a invalid format", async () => {
      try {
        orderValidator.validateDate(faker.random.word());
      } catch (error) {
        expect(error.message).toBe("Informe uma data no formato correto. YYYY-mm-dd hh:mm:ss");
      }
    });

    test("Should throw error if date is greater than today", async () => {
      try {
        expect(orderValidator.validateDate(generateLaterDate())).toBe(undefined);
      } catch (error) {
        expect(error.message).toBe("A data do pedido deve ser menor que a atual.");
      }
    });
  });

  describe("valueInCents", () => {
    test("Should not throw error if valueInCents is greater than zero.", () => {
      expect(orderValidator.validatevalueInCents(faker.datatype.number())).toBe(undefined);
    });

    test("Should throw error if valueInCents is less than or equal zero.", () => {
      try {
        orderValidator.validatevalueInCents(-faker.datatype.number());
      } catch (error) {
        expect(error.message).toBe("O valor da compra deve ser maior que 0.");
      }
    });
  });

  describe("status", () => {
    test("Should not throw error if status is correct.", () => {
      expect(orderValidator.validateStatus(faker.random.arrayElement(ORDER_STATUS))).toBe(
        undefined
      );
    });

    test("Should throw error if status is not correct.", () => {
      try {
        orderValidator.validateStatus(faker.random.word());
      } catch (error) {
        expect(error.message).toBe("O status informado não é válido.");
      }
    });
  });
});
