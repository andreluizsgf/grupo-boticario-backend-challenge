import faker from "faker";
import OrderValidator from "../../domain/common/validators/OrderValidator";
import { generate } from "gerador-validador-cpf";
import { ORDER_STATUS } from "../../domain/entities/Order";
import { generateLaterDate } from "../mocks/order";

const orderValidator = new OrderValidator();

describe("Order Validator", () => {
    describe("cpf", () => {
        test("should return an access token when login succeed", async () => {
            const cpf = generate();
            expect(orderValidator.validateCpf(cpf, cpf)).toBe(undefined);
        });

        test("should throw error if dealer cpf and given cpf are not same.", async () => {
            try {
                orderValidator.validateCpf(generate(), generate())
            } catch (error: any) {
                expect(error.message).toBe("O cpf informado não condiz com o cpf do usuário antenticado.");
            }
        });

        test("should throw error if given cpf is not a cpf.", async () => {
            try {
                orderValidator.validateCpf(faker.random.alphaNumeric(11), generate());
            } catch (error: any) {
                expect(error.message).toBe("O cpf informado é inválido.");
            }
        });
    });

    describe("date", () => {
        test("should not throw error when date is valid.", async () => {
            expect(orderValidator.validateDate(new Date().toISOString())).toBe(undefined);
        });

        test("should throw error if date is in a invalid format", async () => {
            try {
                orderValidator.validateDate(faker.random.word());
            } catch (error) {
                expect(error).toBe("Informe uma data no formato correto. YYYY-mm-dd hh:mm:ss");
            }
        });

        test("should throw error if date is greater than today", async () => {
            try {
                expect(orderValidator.validateDate(generateLaterDate())).toBe(undefined);
            } catch (error: any) {
                expect(error.message).toBe("A data do pedido deve ser menor que a atual.");
            }
        });
    })

    describe("subtotal", () => {
        test("should not throw error if subtotal is greater than zero.", () => {
            expect(orderValidator.validateSubtotal(faker.datatype.number())).toBe(undefined);
        })

        test("should throw error if subtotal is less than or equal zero.", () => {
            try {
                orderValidator.validateSubtotal(-faker.datatype.number())
            } catch (error: any) {
                expect(error.message).toBe("O valor da compra deve ser maior que 0.");
            }
        })
    })

    describe("status", () => {
        test("should not throw error if status is correct.", () => {
            expect(orderValidator.validateStatus(faker.random.arrayElement(ORDER_STATUS))).toBe(undefined);
        })

        test("should throw error if status is not correct.", () => {
            try {
                orderValidator.validateStatus(faker.random.word());
            } catch (error: any) {
                expect(error.message).toBe("O status informado não é válido.");
            }
        })
    })
})