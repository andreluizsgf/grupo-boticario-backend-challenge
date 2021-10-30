import request from 'supertest';
import Application from '../../app';
import { CreateDealerRequest, DealerResponse } from '../../domain/dtos/DealerDto';
import { Dealer } from '../../domain/entities/Dealer';
import { mockDealerRequest } from '../mocks/dealer';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { BoticarioResponse } from '../../infra/integrations/BoticarioApiIntegration';

const appi = new Application();
const app = appi.app;
beforeAll(async () => {
    const mock = new MockAdapter(axios);
    mock.onGet('https://mdaqk8ek5j.execute-api.us-east-1.amazonaws.com/v1/cashback?cpf=12345').reply<BoticarioResponse>(200, {
        body: {
            credit: 200
        },
        statusCode: 200
    });

    await appi.start();
});

describe('Create', () => {
    test('Should create a dealer.', async () => {
        const mockDealer: CreateDealerRequest = mockDealerRequest();
        const createDealerResponse = await request(app).post('/dealer').send(mockDealer).expect(201);
        const createdDealer: Dealer = createDealerResponse.body;

        expect(mockDealer).toMatchObject<DealerResponse>({
            cpf: createdDealer.cpf,
            email: createdDealer.email,
            createdAt: createdDealer.createdAt,
            id: createdDealer.id,
            name: createdDealer.name,
            updatedAt: createdDealer.updatedAt
        });
    });
});

describe('Get Cashback', () => {
    test('Should get cashback.', async () => {
        const mockDealer: CreateDealerRequest = mockDealerRequest();
        const createDealerResponse = await request(app).post('/dealer').send(mockDealer).expect(201);
        const createdDealer: Dealer = createDealerResponse.body;

        const authResponse = await request(app).post('/auth/login').send({
            email: mockDealer.email,
            password: mockDealer.password
        }).expect(200);

        const { accessToken } = authResponse.body;
        const getCashbackResponse = await request(app).get('/dealer/cashback').set('Authorization', `Bearer ${accessToken}`).expect(200);

        // console.log(getCashbackResponse.body);
    });
});