import * as express from 'express';
import loginRouter from './loginRouter';
import teamsRouter from './teamsRouter';
import matchesRouter from './matchesRouter';

const routers = express.Router();

routers.use('/login', loginRouter);
routers.use('/teams', teamsRouter);
routers.use('/matches', matchesRouter);

export default routers;
