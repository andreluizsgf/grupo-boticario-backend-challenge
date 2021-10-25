import express from 'express';
import { DealerController } from './app/controllers/DealerController';
import { errorHandler } from './app/middlewares/ErrorMiddleware';
import { DealerService } from './app/services/DealerService';
import { DealerRepository } from './infra/repositories/DealerRepository';
import Router from './routes/routes';

export const app = express();

app.use(express.json());

const dealerRepository = new DealerRepository();
const dealerService = new DealerService(dealerRepository);
const dealerController = new DealerController(dealerService);

new Router(app, dealerController);

app.use(errorHandler);