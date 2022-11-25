import * as jwt from 'jsonwebtoken';
import Ilogin from '../interfaces/Ilogin';
import UserModel from '../database/models/UserModel';

export default class LoginService {
  public getUser = async (obj: Ilogin): Promise<Ilogin> => {
    const { email } = obj;
    const result = await UserModel.findOne({ where: { email } });
    return result as Ilogin;
  };

  public makeToken = async (obj: Ilogin): Promise<string> => {
    const { email, password, role, id, username } = obj;
    const token = jwt.sign({ email, password, role, id, username }, 'jwt_secret');
    return token;
  };
}
