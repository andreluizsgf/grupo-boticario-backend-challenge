import * as express from 'express';
import AuthController from '../app/controllers/AuthController';
import DealerController from '../app/controllers/DealerController';
import AuthMiddleware from '../app/middlewares/AuthMiddleware';
import ErrorMiddleware from '../app/middlewares/ErrorMiddleware';

class Router {
  private dealerController;
  private authController;
  private authMiddleware;
  private errorMiddleware;

  constructor(server: express.Express, dealerController: DealerController, authController: AuthController, authMiddleware: AuthMiddleware, errorMiddleware: ErrorMiddleware) {
    this.dealerController = dealerController;
    this.authController = authController;
    this.authMiddleware = authMiddleware;
    this.errorMiddleware = errorMiddleware;
    const router = express.Router();
    
    router.use('/auth/login', this.authController.login.bind(this.authController));

    router.post('/dealer', this.dealerController.create.bind(this.dealerController));

    router.use(this.authMiddleware.handle.bind(this.authMiddleware));

    router.use(this.errorMiddleware.handle.bind(this.errorMiddleware));
    server.use('/', router);
  }
}

export default Router;