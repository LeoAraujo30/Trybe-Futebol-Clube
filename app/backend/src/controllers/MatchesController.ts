import { Response, Request } from 'express';
import IRequest from '../interfaces/IRequest';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  constructor(private service: MatchesService = new MatchesService()) {}

  public getAllMatches = async (req: Request, res: Response) => {
    if (req.query.inProgress === 'true' || req.query.inProgress === 'false') {
      const result = await this.service.getByInProgress(req.query.inProgress);
      res.status(200).json(result);
    } else {
      const result = await this.service.getAll();
      res.status(200).json(result);
    }
  };

  public addMatche = async (req: IRequest, res: Response) => {
    const result = await this.service.addMatche(req.body);
    return res.status(201).json(result);
  };

  public finishMatche = async (req: IRequest, res: Response) => {
    await this.service.finishMatche(Number(req.params.id));
    return res.status(200).json({ message: 'Finished' });
  };

  public updateMatche = async (req: IRequest, res: Response) => {
    await this.service.updateMatche(Number(req.params.id), req.body);
    return res.status(200).json({ message: 'Updated' });
  };
}
