import { Router, Request, Response, NextFunction } from 'express';
import MatchesController from '../controllers/MatchesController';
import MatchesMiddleware from '../middlewares/MatchesMiddleware';
import 'express-async-errors';

const router = Router();

const controller = new MatchesController();
const middleware = new MatchesMiddleware();

router.get('/', controller.getAllMatches);

router.post('/', middleware.validateToken, middleware.validateMatche, controller.addMatche);

router.patch('/:id/finish', controller.finishMatche);

// router.patch('/:id', controller.finishMatche);

router.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).send({ message: err.message });
  },
);

export default router;
