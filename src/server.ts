import express from 'express';
import { UserController } from './app/controllers/UserController';
import { UserRepository } from './infra/repositories/UserRepository';
import Router from './routes/routes';
const app = express();

app.use(express.json())

const userRepository = new UserRepository()
const userController = new UserController(userRepository);

new Router(app, userController);

app.listen(3000, () => {
    console.log("listening on port 3000");
});