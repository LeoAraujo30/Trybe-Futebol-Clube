import { Request } from 'express';
import Ilogin from './Ilogin';

export type data = {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  iat?: number;
};

export default interface IRequest extends Request {
  user?: Ilogin
  data?: data;
}
