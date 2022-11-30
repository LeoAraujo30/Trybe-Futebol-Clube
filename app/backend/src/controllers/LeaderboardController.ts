import { Response, Request } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(private service: LeaderboardService = new LeaderboardService()) {}

  public getAllByHomeTeam = async (req: Request, res: Response) => {
    const result = await this.service.getAllByHomeTeam();
    res.status(200).json(result);
  };

  public getAllByAwayTeam = async (req: Request, res: Response) => {
    const result = await this.service.getAllByAwayTeam();
    res.status(200).json(result);
  };

  public getAll = async (req: Request, res: Response) => {
    const result = await this.service.getAll();
    res.status(200).json(result);
  };
}
