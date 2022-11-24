import { Response, Request } from 'express';
import LoginService from '../services/LoginService';

export default class LoginController {
  constructor(private service: LoginService = new LoginService()) {}

  public makeToken = async (req: Request, res: Response) => {
    const token = await this.service.makeToken(req.body);
    res.status(200).json({ token });
  };

//   public makeLogin = async (req: Request, res: Response) => {
//     const { role } = req.data;
//     res.status(200).json({ role });
//   };
}
