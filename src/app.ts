import express from 'express';
import AuthController from './app/controllers/AuthController';
import DealerController from './app/controllers/DealerController';
import AuthMiddleware from './app/middlewares/AuthMiddleware';
import ErrorMiddleware from './app/middlewares/ErrorMiddleware';
import AuthService from './app/services/AuthService';
import DealerService from './app/services/DealerService';
import DealerRepository from './infra/repositories/DealerRepository';
import Router from './routes/routes';
import 'reflect-metadata';
import { Express } from "express";

export default class Application {
    private repositories = this.initializeRepositories();
    private services = this.initializeServices();
    private controllers = this.initializeControllers();
    private middlewares = this.initializeMiddlewares();
    public app: Express = express();

    private initializeRepositories() {
        return {
            dealerRepository: new DealerRepository()
        };
    }

    private initializeServices() {
        return {
            dealerService: new DealerService(this.repositories.dealerRepository),
            authService: new AuthService(this.repositories.dealerRepository)
        };
    }

    private initializeControllers() {
        return {
            dealerController: new DealerController(this.services.dealerService),
            authController: new AuthController(this.services.authService)
        }
    }

    private initializeMiddlewares() {
        return {
            authMiddleware: new AuthMiddleware(this.repositories.dealerRepository),
            errorMiddleware: new ErrorMiddleware()
        }
    }

    public start() {
        this.app.use(express.json());
        new Router(this.app, this.controllers.dealerController, this.controllers.authController, this.middlewares.authMiddleware, this.middlewares.errorMiddleware);
    }
};

