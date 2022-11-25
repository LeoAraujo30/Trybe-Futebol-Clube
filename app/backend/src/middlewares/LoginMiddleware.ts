import { NextFunction, Response } from 'express';
import Joi = require('joi');
import { compareSync } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import IRequest, { data } from '../interfaces/IRequest';
import LoginService from '../services/LoginService';

const login = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export default class LoginMiddleware {
  constructor(private service: LoginService = new LoginService()) {}

  public validateLogin = async (req: IRequest, res: Response, next: NextFunction) => {
    const { error } = login.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    const user = await this.service.getUser(req.body);
    if (!user || !compareSync(req.body.password, user.password)) {
      res.status(401).json({ message: 'Incorrect email or password' });
    } else {
      req.user = user;
      next();
    }
  };

  public validateToken = async (req: IRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'Token not found' });
    }
    try {
      const result = jwt.verify(authorization, 'jwt_secret');
      req.data = result as data;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Expired or invalid token' });
    }
  };
}
