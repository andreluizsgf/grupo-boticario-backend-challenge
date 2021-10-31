import express from "express";
import Router from "./routes";
import { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import DealerValidator from "../domain/common/validators/DealerValidator";
import OrderValidator from "../domain/common/validators/OrderValidator";
import BoticarionApiIntegration from "../infra/integrations/BoticarioApiIntegration";
import DealerRepository from "../infra/repositories/DealerRepository";
import OrderRepository from "../infra/repositories/OrderRepository";
import AuthController from "./controllers/AuthController";
import DealerController from "./controllers/DealerController";
import OrderController from "./controllers/OrderController";
import AuthMiddleware from "./middlewares/AuthMiddleware";
import ErrorMiddleware from "./middlewares/ErrorMiddleware";
import AuthService from "./services/AuthService";
import DealerService from "./services/DealerService";
import OrderService from "./services/OrderService";
import { knex } from "../infra/knex";
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
