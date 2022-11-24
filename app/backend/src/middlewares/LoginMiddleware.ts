import { NextFunction, Request, Response } from 'express';
import Joi = require('joi');
import * as jwt from 'jsonwebtoken';
import LoginService from '../services/LoginService';

const login = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export default class LoginMiddleware {
  constructor(private service: LoginService = new LoginService()) {}

  public validateLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = login.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    const user = await this.service.getUser(req.body);
    if (!user || user.password !== req.body.password) {
      res.status(401).json({ message: 'Incorrect email or password' });
    } else {
      next();
    }
  };

//   public validateToken = async (req: Request, res: Response, next: NextFunction) => {
//     const { authorization } = req.headers;
//     if (!authorization) {
//       return res.status(401).json({ message: 'Token not found' });
//     }
//     try {
//       const data = jwt.verify(authorization, 'secret');
//       req.data = data;
//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Expired or invalid token' });
//     }
//   };
}
