import * as express from 'express';
import loginRouter from './loginRouter';
import teamsRouter from './teamsRouter';

const routers = express.Router();

routers.use('/login', loginRouter);
routers.use('/teams', teamsRouter);

export default routers;
