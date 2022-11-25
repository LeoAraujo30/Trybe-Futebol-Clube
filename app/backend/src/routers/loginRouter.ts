import { Router, Request, Response, NextFunction } from 'express';
import LoginController from '../controllers/LoginController';
import LoginMiddleware from '../middlewares/LoginMiddleware';
import 'express-async-errors';

const router = Router();

const middleware = new LoginMiddleware();

const controller = new LoginController();

router.post('/', middleware.validateLogin, controller.makeToken);

router.get('/validate', middleware.validateToken, controller.makeLogin);

router.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).send({ message: err.message });
  },
);

export default router;
