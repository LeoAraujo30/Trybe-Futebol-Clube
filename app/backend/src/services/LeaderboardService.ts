import MatchesService from './MatchesService';
import TeamModel from '../database/models/TeamModel';
import Ileaderboard from '../interfaces/Ileaderboard';
import Imatches from '../interfaces/Imatches';
import Iteam from '../interfaces/Iteam';

type teamGoals = 'homeTeamGoals' | 'awayTeamGoals';
type teamMatche = 'home' | 'away';

export default class LeaderboardService {
  constructor(private matchesService: MatchesService = new MatchesService()) {}

  private getTotalPoints = (matches: Imatches[], key1: teamGoals, key2: teamGoals): number => {
    let result = 0;
    matches.forEach((matche) => {
      if (matche[key1] > matche[key2]) {
        result += 3;
      } else if (matche[key1] < matche[key2]) {
        result += 0;
      } else {
        result += 1;
      }
    });
    return result;
  };

  private getTotalGames = (matches: Imatches[]): number => matches.length;

  private getTotalVictories = (matches: Imatches[], key1: teamGoals, key2: teamGoals): number => {
    let result = 0;
    matches.forEach((matche) => {
      if (matche[key1] > matche[key2]) {
        result += 1;
      } else {
        result += 0;
      }
    });
    return result;
  };

  private getTotalDraws = (matches: Imatches[], key1: teamGoals, key2: teamGoals): number => {
    let result = 0;
    matches.forEach((matche) => {
      if (matche[key1] === matche[key2]) {
        result += 1;
      } else {
        result += 0;
      }
    });
    return result;
  };

  private getTotalLosses = (matches: Imatches[], key1: teamGoals, key2: teamGoals): number => {
    let result = 0;
    matches.forEach((matche) => {
      if (matche[key1] < matche[key2]) {
        result += 1;
      } else {
        result += 0;
      }
    });
    return result;
  };

  private getGoalsFavor = (matches: Imatches[], key: teamGoals): number => {
    const result = matches.reduce((acc, matche) => acc + matche[key], 0);
    return result;
  };

  private getGoalsOwn = (matches: Imatches[], key: teamGoals): number => {
    const result = matches.reduce((acc, matche) => acc + matche[key], 0);
    return result;
  };

  private getGoalsBalance = (matches: Imatches[], key1: teamGoals, key2: teamGoals): number => {
    const result = this.getGoalsFavor(matches, key1) - this.getGoalsOwn(matches, key2);
    return result;
  };

  private getEfficiency = (matches: Imatches[], key1: teamGoals, key2: teamGoals): number => {
    const result = (
      this.getTotalPoints(matches, key1, key2) / (this.getTotalGames(matches) * 3)
    ) * 100;
    return Number(result.toFixed(2));
  };

  private getAllTeams = async (): Promise<Iteam[]> => {
    const result = await TeamModel.findAll();
    return result as Iteam[];
  };

  private orderLeaderboard = (leaderboards: Ileaderboard[]): Ileaderboard[] => {
    const result = leaderboards.sort((a, b) => (
      b.totalPoints - a.totalPoints || b.totalVictories - a.totalVictories
      || b.goalsBalance - a.goalsBalance || b.goalsFavor - a.goalsFavor || b.goalsOwn - a.goalsOwn
    ));
    return result;
  };

  public getTeamsByMatchesIn = async (str: teamMatche): Promise<Ileaderboard[]> => {
    const teams = await this.getAllTeams();
    const matches = await this.matchesService.getByInProgress('false');
    const key1 = str === 'home' ? 'homeTeamGoals' : 'awayTeamGoals';
    const key2 = str === 'home' ? 'awayTeamGoals' : 'homeTeamGoals';
    const result = teams.map((team) => {
      const filter = matches.filter((mat) => mat[`${str}Team`] === team.id);
      return {
        name: team.teamName,
        totalPoints: this.getTotalPoints(filter, key1, key2),
        totalGames: this.getTotalGames(filter),
        totalVictories: this.getTotalVictories(filter, key1, key2),
        totalDraws: this.getTotalDraws(filter, key1, key2),
        totalLosses: this.getTotalLosses(filter, key1, key2),
        goalsFavor: this.getGoalsFavor(filter, key1),
        goalsOwn: this.getGoalsOwn(filter, key2),
        goalsBalance: this.getGoalsBalance(filter, key1, key2),
        efficiency: this.getEfficiency(filter, key1, key2),
      };
    });
    return this.orderLeaderboard(result) as Ileaderboard[];
  };

  private joinAllTeamMatches = (home: Ileaderboard, away: Ileaderboard): Ileaderboard => {
    const result = {
      name: home.name,
      totalPoints: home.totalPoints + away.totalPoints,
      totalGames: home.totalGames + away.totalGames,
      totalVictories: home.totalVictories + away.totalVictories,
      totalDraws: home.totalDraws + away.totalDraws,
      totalLosses: home.totalLosses + away.totalLosses,
      goalsFavor: home.goalsFavor + away.goalsFavor,
      goalsOwn: home.goalsOwn + away.goalsOwn,
      goalsBalance: home.goalsBalance + away.goalsBalance,
      efficiency: Number((
        ((home.totalPoints + away.totalPoints) / ((home.totalGames + away.totalGames) * 3)) * 100
      ).toFixed(2)),
    };
    return result as Ileaderboard;
  };

  public getAll = async (): Promise<Ileaderboard[]> => {
    const teams = await this.getAllTeams();
    const inHome = await this.getTeamsByMatchesIn('home');
    const inAway = await this.getTeamsByMatchesIn('away');
    const result = teams.map(({teamName}) => {
      const homeTeam = inHome.find((team) => team.name === teamName) as Ileaderboard;
      const awayTeam = inAway.find((team) => team.name === teamName) as Ileaderboard;
      return this.joinAllTeamMatches(homeTeam, awayTeam);
    });
    return this.orderLeaderboard(result) as Ileaderboard[];
  };
}
