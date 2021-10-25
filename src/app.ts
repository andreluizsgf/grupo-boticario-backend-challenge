import express from 'express';
import { AuthController } from './app/controllers/AuthController';
import { DealerController } from './app/controllers/DealerController';
import AuthMiddleware from './app/middlewares/AuthMiddleware';
import { errorHandler } from './app/middlewares/ErrorMiddleware';
import { AuthService } from './app/services/AuthService';
import { DealerService } from './app/services/DealerService';
import { DealerRepository } from './infra/repositories/DealerRepository';
import Router from './routes/routes';

export const app = express();

app.use(express.json());

const dealerRepository = new DealerRepository();
const dealerService = new DealerService(dealerRepository);
const dealerController = new DealerController(dealerService);

const authService = new AuthService(dealerRepository);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware(dealerRepository);

new Router(app, dealerController, authController, authMiddleware);
app.use(errorHandler);
