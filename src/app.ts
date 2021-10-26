import express from 'express';
import AuthController from './app/controllers/AuthController';
import DealerController from './app/controllers/DealerController';
import AuthMiddleware from './app/middlewares/AuthMiddleware';
import ErrorMiddleware from './app/middlewares/ErrorMiddleware';
import AuthService from './app/services/AuthService';
import DealerService from './app/services/DealerService';
import DealerRepository from './infra/repositories/DealerRepository';
import Router from './routes/routes';
import { Express } from "express";
import DealerValidator from './domain/common/validators/DealerValidator';
import OrderController from './app/controllers/OrderController';
import OrderService from './app/services/OrderService';
import OrderRepository from './infra/repositories/OrderRepository';
import OrderValidator from './domain/common/validators/OrderValidator';

export default class Application {
    private validators = this.initializeValidators();
    private repositories = this.initializeRepositories();
    private services = this.initializeServices();
    private controllers = this.initializeControllers();
    private middlewares = this.initializeMiddlewares();
    public app: Express = express();

    private initializeRepositories() {
        return {
            dealerRepository: new DealerRepository(),
            orderRepository: new OrderRepository()
        };
    }

    private initializeServices() {
        return {
            dealerService: new DealerService(this.repositories.dealerRepository, this.validators.dealerValidator),
            authService: new AuthService(this.repositories.dealerRepository),
            orderService: new OrderService(this.repositories.orderRepository, this.repositories.dealerRepository, this.validators.orderValidator)
        };
    }

    private initializeControllers() {
        return {
            dealerController: new DealerController(this.services.dealerService),
            authController: new AuthController(this.services.authService),
            orderController: new OrderController(this.services.orderService)
        }
    }

    private initializeMiddlewares() {
        return {
            authMiddleware: new AuthMiddleware(this.repositories.dealerRepository),
            errorMiddleware: new ErrorMiddleware()
        }
    }

    private initializeValidators() {
        return {
            dealerValidator: new DealerValidator(),
            orderValidator: new OrderValidator(),
        }
    }

    public start() {
        this.app.use(express.json());
        new Router(this.app, this.controllers.dealerController, this.controllers.authController, this.controllers.orderController, this.middlewares.authMiddleware, this.middlewares.errorMiddleware);
    }
};

