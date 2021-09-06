import * as express from 'express';
import { UserController } from '../app/controllers/UserController';
import { IUserRepository } from '../domain/database/repositories/IUserRepository';

class Router {
  private userController;

  constructor(server: express.Express, userController: UserController) {
    this.userController = userController;
    const router = express.Router();

    router.post('/', this.userController.create.bind(this.userController));

    server.use('/', router);
  }
}

export default Router;