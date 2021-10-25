import * as express from 'express';
import { AuthController } from '../app/controllers/AuthController';
import { DealerController } from '../app/controllers/DealerController';
import AuthMiddleware from '../app/middlewares/AuthMiddleware';

class Router {
  private dealerController;
  private authController;
  private authMiddleware;

  constructor(server: express.Express, dealerController: DealerController, authController: AuthController, authMiddleware: AuthMiddleware) {
    this.dealerController = dealerController;
    this.authController = authController;
    this.authMiddleware = authMiddleware;
    const router = express.Router();

    router.use(this.authMiddleware.handle.bind(this.authMiddleware));
    router.post('/dealer', this.dealerController.create.bind(this.dealerController));
    router.use('/auth/login', this.authController.login.bind(this.authController));

    server.use('/', router);
  }
}

export default Router;