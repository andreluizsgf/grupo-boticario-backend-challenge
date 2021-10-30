import e from "express";
import { CreateDealerRequest } from "../domain/dtos/DealerDto";
import { Dealer } from "../domain/entities/Dealer";
import { mockDealerRequest } from "./mocks/dealer";
import request from "supertest";

export async function getValidAccessToken(app: e.Express, partialDealer?: Partial<Dealer>) {
  const mockDealer: CreateDealerRequest = mockDealerRequest(partialDealer);
  await request(app).post("/dealer").send(mockDealer).expect(201);

  const authResponse = await request(app)
    .post("/auth/login")
    .send({
      email: mockDealer.email,
      password: mockDealer.password,
    })
    .expect(200);

  const { accessToken } = authResponse.body;

  return { mockDealer, accessToken };
}
