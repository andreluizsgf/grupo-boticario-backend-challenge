import express from 'express';
import { UserController } from './app/controllers/UserController';
import { errorHandler } from './app/middlewares/ErrorMiddleware';
import { UserService } from './app/services/UserService';
import { UserRepository } from './infra/repositories/UserRepository';
import Router from './routes/routes';
const app = express();

app.use(express.json());

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

new Router(app, userController);

app.use(errorHandler);

app.listen(3000, () => {
    console.log("listening on port 3000");
});