import DealerRepository from '../../infra/repositories/DealerRepository';
import sinon from 'sinon';
import { mockDbDealer, mockDealerRequest } from '../mocks/dealer';
import Sinon from 'sinon';
import AuthService from '../../app/services/AuthService';
import { hash } from 'bcrypt';
import faker from 'faker';
import NotFoundException from '../../domain/dtos/Error';

const sandbox: Sinon.SinonSandbox = sinon.createSandbox();

const dealerRepository = new DealerRepository();
const authService = new AuthService(dealerRepository);

beforeEach(() => {
    sandbox.restore();
});

describe('Dealer Service', () => {
    describe('login', () => {
        test('Should generate a valid access token when dealer credentials are correct.', async () => {
            const password = faker.internet.password();
            const dbDealer = mockDbDealer({
                password: await hash(password, 10)
            });

            sandbox.stub(DealerRepository.prototype, 'findOneBy').returns(Promise.resolve(dbDealer));

            const accessToken = await authService.login({
                email: dbDealer.email,
                password,
            });

            expect(accessToken).toBeDefined();
        });

        test('Should throw error when dealer email or password are incorrect', async () => {
            sandbox.stub(DealerRepository.prototype, 'findOneBy').returns(Promise.resolve(undefined));

            const act = authService.login({
                email: faker.internet.email(),
                password: faker.internet.password(),
            });

            expect(act).rejects.toThrowError('Dados de login inválidos.');
            expect(act).rejects.toBeInstanceOf(NotFoundException);
        });
    });
});