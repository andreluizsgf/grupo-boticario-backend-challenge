import * as express from 'express';
import { DealerController } from '../app/controllers/DealerController';

class Router {
  private dealerController;

  constructor(server: express.Express, dealerController: DealerController) {
    this.dealerController = dealerController;
    const router = express.Router();

    router.post('/', this.dealerController.create.bind(this.dealerController));

    server.use('/dealer', router);
  }
}

export default Router;