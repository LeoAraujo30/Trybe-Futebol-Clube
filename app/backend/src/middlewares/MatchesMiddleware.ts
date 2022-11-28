import { NextFunction, Response } from 'express';
import Joi = require('joi');
import * as jwt from 'jsonwebtoken';
import IRequest, { data } from '../interfaces/IRequest';
import TeamsService from '../services/TeamsService';

const matche = Joi.object({
  homeTeam: Joi.number().min(1).required(),
  awayTeam: Joi.number().min(1).required(),
  homeTeamGoals: Joi.number().min(0).required(),
  awayTeamGoals: Joi.number().min(0).required(),
});

export default class MatchesMiddleware {
  constructor(private service: TeamsService = new TeamsService()) {}

  public validateMatche = async (req: IRequest, res: Response, next: NextFunction) => {
    const { error } = matche.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }
    if (req.body.homeTeam === req.body.awayTeam) {
      return res.status(422).json(
        { message: 'It is not possible to create a match with two equal teams' },
      );
    }
    const homeTeam = await this.service.getOne(req.body.homeTeam);
    const awayTeam = await this.service.getOne(req.body.awayTeam);
    if (!homeTeam || !awayTeam) {
      res.status(404).json({ message: 'There is no team with such id!' });
    } else {
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
      res.status(401).json({ message: 'Token must be a valid token' });
    }
  };
}
