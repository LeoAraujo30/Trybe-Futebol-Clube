import { Response } from 'express';
import IRequest from '../interfaces/IRequest';
import LoginService from '../services/LoginService';

export default class LoginController {
  constructor(private service: LoginService = new LoginService()) {}

  public makeToken = async (req: IRequest, res: Response) => {
    if (req.user) {
      const token = await this.service.makeToken(req.user);
      res.status(200).json({ token });
    }
  };

  public makeLogin = async (req: IRequest, res: Response) => {
    if (req.data) {
      const { role } = req.data;
      res.status(200).json({ role });
    }
  };
}
