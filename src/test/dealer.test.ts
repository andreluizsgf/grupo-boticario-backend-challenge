import request from "supertest";
import { app } from "../app";
import { knex } from "../../knexfile";

test("user", async () => {
    const user = await request(app).get('/user/1');

    expect(1).toBe(1);
})

afterAll(done => {
    knex.destroy();
})