import * as express from 'express';
import loginRouter from './loginRouter';

const routers = express.Router();

routers.use('/login', loginRouter);

export default routers;
