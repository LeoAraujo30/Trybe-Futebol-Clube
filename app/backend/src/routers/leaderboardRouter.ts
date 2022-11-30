import { Router, Request, Response, NextFunction } from 'express';
import LeaderboardController from '../controllers/LeaderboardController';
import 'express-async-errors';

const router = Router();

const controller = new LeaderboardController();

router.get('/home', controller.getAllByHomeTeam);

router.get('/away', controller.getAllByAwayTeam);

router.get('/', controller.getAll);

router.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).send({ message: err.message });
  },
);

export default router;
