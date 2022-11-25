import TeamModel from '../database/models/TeamModel';
import Iteam from '../interfaces/Iteam';

export default class TeamsService {
  public getAll = async (): Promise<Iteam[]> => {
    const result = await TeamModel.findAll();
    return result as Iteam[];
  };

  public getOne = async (id: number): Promise<Iteam> => {
    const result = await TeamModel.findByPk(id);
    return result as Iteam;
  };
}
