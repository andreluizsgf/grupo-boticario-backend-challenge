import * as express from 'express';
import AuthController from '../app/controllers/AuthController';
import DealerController from '../app/controllers/DealerController';
import AuthMiddleware from '../app/middlewares/AuthMiddleware';
import ErrorMiddleware from '../app/middlewares/ErrorMiddleware';
import OrderController from '../app/controllers/OrderController';

class Router {
  private dealerController;
  private authController;
  private orderController;
  private authMiddleware;
  private errorMiddleware;

  constructor(
    server: express.Express,
    dealerController: DealerController,
    authController: AuthController,
    orderController: OrderController,
    authMiddleware: AuthMiddleware,
    errorMiddleware: ErrorMiddleware
  ) {
    this.dealerController = dealerController;
    this.authController = authController;
    this.orderController = orderController;
    this.authMiddleware = authMiddleware;
    this.errorMiddleware = errorMiddleware;
    const router = express.Router();

    router.use('/auth/login', this.authController.login.bind(this.authController));

    router.post('/dealer', this.dealerController.create.bind(this.dealerController));

    router.use(this.authMiddleware.handle.bind(this.authMiddleware));

    router.get('/dealer/cashback', this.dealerController.getCashback.bind(this.dealerController));
    router.post('/order', this.orderController.create.bind(this.orderController));
    router.get('/order', this.orderController.list.bind(this.orderController));

    router.use(this.errorMiddleware.handle.bind(this.errorMiddleware));
    server.use('/', router);
  }
}

export default Router;
