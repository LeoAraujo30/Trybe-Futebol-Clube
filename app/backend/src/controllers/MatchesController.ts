import { Response, Request } from 'express';
// import IRequest from '../interfaces/IRequest';
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

//   public getTeam = async (req: IRequest, res: Response) => {
//     const { id } = req.params;
//     const result = await this.service.getOne(Number(id));
//     if (!result) return res.status(404).json({ message: 'Team not found' });
//     return res.status(200).json(result);
//   };
}
