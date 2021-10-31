import express from "express";
import AuthController from "./app/controllers/AuthController";
import DealerController from "./app/controllers/DealerController";
import AuthMiddleware from "./app/middlewares/AuthMiddleware";
import ErrorMiddleware from "./app/middlewares/ErrorMiddleware";
import AuthService from "./app/services/AuthService";
import DealerService from "./app/services/DealerService";
import DealerRepository from "./infra/repositories/DealerRepository";
import Router from "./routes/routes";
import { Express } from "express";
import DealerValidator from "./domain/common/validators/DealerValidator";
import OrderController from "./app/controllers/OrderController";
import OrderService from "./app/services/OrderService";
import OrderRepository from "./infra/repositories/OrderRepository";
import OrderValidator from "./domain/common/validators/OrderValidator";
import { knex } from "./infra/knex";
import BoticarionApiIntegration from "./infra/integrations/BoticarioApiIntegration";
import morgan from "morgan";
import cors from "cors";
export default class Application {
  private validators = this.initializeValidators();
  private repositories = this.initializeRepositories();
  private integrations = this.initializeIntegrations();
  private services = this.initializeServices();
  private controllers = this.initializeControllers();
  private middlewares = this.initializeMiddlewares();
  public app: Express = express();

  private initializeRepositories() {
    return {
      dealerRepository: new DealerRepository(),
      orderRepository: new OrderRepository(),
    };
  }

  private initializeServices() {
    return {
      dealerService: new DealerService(
        this.repositories.dealerRepository,
        this.validators.dealerValidator,
        this.integrations.boticarionIntegration
      ),
      authService: new AuthService(this.repositories.dealerRepository),
      orderService: new OrderService(
        this.repositories.orderRepository,
        this.repositories.dealerRepository,
        this.validators.orderValidator
      ),
    };
  }

  private initializeControllers() {
    return {
      dealerController: new DealerController(this.services.dealerService),
      authController: new AuthController(this.services.authService),
      orderController: new OrderController(this.services.orderService),
    };
  }

  private initializeMiddlewares() {
    return {
      authMiddleware: new AuthMiddleware(this.repositories.dealerRepository),
      errorMiddleware: new ErrorMiddleware(),
    };
  }

  private initializeValidators() {
    return {
      dealerValidator: new DealerValidator(),
      orderValidator: new OrderValidator(),
    };
  }

  private initializeIntegrations() {
    return {
      boticarionIntegration: new BoticarionApiIntegration(),
    };
  }

  public async start() {
    await knex.migrate.latest();
    this.app.use(cors());

    if (!process.env.TEST) {
      this.app.use(morgan(":date[iso] :method :url -> :status [:response-time ms]"));
    }

    this.app.use(express.json());
    new Router(
      this.app,
      this.controllers.dealerController,
      this.controllers.authController,
      this.controllers.orderController,
      this.middlewares.authMiddleware,
      this.middlewares.errorMiddleware
    );
  }
}
