import { Model, INTEGER, BOOLEAN } from 'sequelize';
import db from '.';
import TeamModel from './TeamModel';

class MatcheModel extends Model {
  declare id: number;
  declare homeTeam: number;
  declare homeTeamGoals: number;
  declare awayTeam: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

MatcheModel.init({
  id: { primaryKey: true, type: INTEGER, allowNull: false, autoIncrement: true },
  homeTeam: { type: INTEGER, allowNull: false },
  homeTeamGoals: { type: INTEGER, allowNull: false },
  awayTeam: { type: INTEGER, allowNull: false },
  awayTeamGoals: { type: INTEGER, allowNull: false },
  inProgress: { type: BOOLEAN, allowNull: false },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

TeamModel.hasMany(MatcheModel, { foreignKey: 'homeTeam', as: 'matchesHome' });
TeamModel.hasMany(MatcheModel, { foreignKey: 'awayTeam', as: 'matchesAway' });

MatcheModel.belongsTo(TeamModel, { foreignKey: 'homeTeam', as: 'teamHome' });
MatcheModel.belongsTo(TeamModel, { foreignKey: 'awayTeam', as: 'teamAway' });

export default MatcheModel;
