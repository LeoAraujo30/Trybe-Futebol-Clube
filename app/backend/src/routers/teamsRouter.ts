import { Router, Request, Response, NextFunction } from 'express';
import TeamsController from '../controllers/TeamsController';
import 'express-async-errors';

const router = Router();

const controller = new TeamsController();

router.get('/', controller.getAllTeams);
router.get('/:id', controller.getTeam);

router.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).send({ message: err.message });
  },
);

export default router;
