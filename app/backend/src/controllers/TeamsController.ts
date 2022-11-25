import { Response } from 'express';
import IRequest from '../interfaces/IRequest';
import TeamsService from '../services/TeamsService';

export default class TeamsController {
  constructor(private service: TeamsService = new TeamsService()) {}

  public getAllTeams = async (_req: IRequest, res: Response) => {
    const result = await this.service.getAll();
    res.status(200).json(result);
  };

  public getTeam = async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const result = await this.service.getOne(Number(id));
    if (!result) return res.status(404).json({ message: 'Team not found' });
    return res.status(200).json(result);
  };
}
