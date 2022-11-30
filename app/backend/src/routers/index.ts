import * as express from 'express';
import loginRouter from './loginRouter';
import teamsRouter from './teamsRouter';
import matchesRouter from './matchesRouter';
import leaderboardRouter from './leaderboardRouter';

const routers = express.Router();

routers.use('/login', loginRouter);
routers.use('/teams', teamsRouter);
routers.use('/matches', matchesRouter);
routers.use('/leaderboard', leaderboardRouter);

export default routers;
