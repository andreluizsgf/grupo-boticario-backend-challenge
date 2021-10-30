import DealerRepository from "../../infra/repositories/DealerRepository";
import sinon from "sinon";
import Sinon from "sinon";
import AuthMiddleware from "../../app/middlewares/AuthMiddleware";
import express from "express";
import jwt from "jsonwebtoken";
import { mockDbDealer } from "../mocks/dealer";

const sandbox: Sinon.SinonSandbox = sinon.createSandbox();

const dealerRepository = new DealerRepository();
const authMiddleware = new AuthMiddleware(dealerRepository);

beforeEach(() => {
  sandbox.restore();
});

describe("Auth Middleware", () => {
  test("Should throw error when access token is not informed.", async () => {
    const mockRequest = {
      headers: {
        authorization: undefined,
      },
    } as express.Request;

    const mockResponse = {} as express.Response;

    await authMiddleware.handle(mockRequest, mockResponse, () => {
      return;
    });

    const act = await authMiddleware.handle(mockRequest, mockResponse, () => {
      return;
    });

    expect(act).toBe(undefined);
  });

  test("Should throw error when there is no dealer with informed credentials.", async () => {
    process.env.JWT_SECRET = "HS256";

    const mockRequest = {
      headers: {
        authorization: jwt.sign({ dealer: mockDbDealer() }, process.env.JWT_SECRET!, {
          expiresIn: "7d",
        }),
      },
    } as express.Request;

    const mockResponse = {} as express.Response;

    const act = await authMiddleware.handle(mockRequest, mockResponse, () => {});

    expect(act).toBe(undefined);
  });
});
