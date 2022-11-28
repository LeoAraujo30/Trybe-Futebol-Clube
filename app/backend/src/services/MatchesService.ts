import MatcheModel from '../database/models/MatcheModel';
import TeamModel from '../database/models/TeamModel';
import Imatches from '../interfaces/Imatches';

export default class MatchesService {
  public getAll = async (): Promise<Imatches[]> => {
    const result = await MatcheModel.findAll({
      include: [
        { model: TeamModel, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: TeamModel, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });
    return result;
  };

  public getByInProgress = async (string: 'true' | 'false'): Promise<Imatches[]> => {
    const inProgress = string === 'true';
    const result = await MatcheModel.findAll({
      where: { inProgress },
      include: [
        { model: TeamModel, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: TeamModel, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });
    return result;
  };
}
