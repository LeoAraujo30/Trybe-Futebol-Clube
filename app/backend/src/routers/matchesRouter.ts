import { Router, Request, Response, NextFunction } from 'express';
import MatchesController from '../controllers/MatchesController';
import 'express-async-errors';

const router = Router();

const controller = new MatchesController();

router.get('/', controller.getAllMatches);

router.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).send({ message: err.message });
  },
);

export default router;
