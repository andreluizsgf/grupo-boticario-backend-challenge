import * as express from 'express';
import { UserController } from '../app/controllers/UserController';

class Router {
  private userController;

  constructor(server: express.Express, userController: UserController) {
    this.userController = userController;
    const router = express.Router();

    router.post('/', this.userController.create.bind(this.userController));
    router.get('/:id', this.userController.get.bind(this.userController));

    server.use('/user', router);
  }
}

export default Router;