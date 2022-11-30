import MatchesService from './MatchesService';
import TeamModel from '../database/models/TeamModel';
import Ileaderboard from '../interfaces/Ileaderboard';
import Imatches from '../interfaces/Imatches';
import Iteam from '../interfaces/Iteam';

type teamGoals = 'homeTeamGoals' | 'awayTeamGoals';

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

  // private orderLeaderboard = (leaderboards: Ileaderboard[]): Ileaderboard[] => {
  //   const result = leaderboards.map((leader1) => {
  //     leaderboards.forEach((leader2) => {
  //       if (leader1.totalPoints < leader2.totalPoints) {
  //       }
  //     });
  //   });
  //   return result;
  // };

  public getAllByHomeTeam = async (): Promise<Ileaderboard[]> => {
    const teams = await this.getAllTeams();
    const matches = await this.matchesService.getByInProgress('false');
    const result = teams.map((team) => {
      const filter = matches.filter((mat) => mat.homeTeam === team.id);
      return {
        name: team.teamName,
        totalPoints: this.getTotalPoints(filter, 'homeTeamGoals', 'awayTeamGoals'),
        totalGames: this.getTotalGames(filter),
        totalVictories: this.getTotalVictories(filter, 'homeTeamGoals', 'awayTeamGoals'),
        totalDraws: this.getTotalDraws(filter, 'homeTeamGoals', 'awayTeamGoals'),
        totalLosses: this.getTotalLosses(filter, 'homeTeamGoals', 'awayTeamGoals'),
        goalsFavor: this.getGoalsFavor(filter, 'homeTeamGoals'),
        goalsOwn: this.getGoalsOwn(filter, 'awayTeamGoals'),
        goalsBalance: this.getGoalsBalance(filter, 'homeTeamGoals', 'awayTeamGoals'),
        efficiency: this.getEfficiency(filter, 'homeTeamGoals', 'awayTeamGoals'),
      };
    });
    return result as Ileaderboard[];
  };

  public getAllByAwayTeam = async (): Promise<Ileaderboard[]> => {
    const teams = await this.getAllTeams();
    const matches = await this.matchesService.getByInProgress('false');
    const result = teams.map((team) => {
      const filter = matches.filter((mat) => mat.awayTeam === team.id);
      return {
        name: team.teamName,
        totalPoints: this.getTotalPoints(filter, 'awayTeamGoals', 'homeTeamGoals'),
        totalGames: this.getTotalGames(filter),
        totalVictories: this.getTotalVictories(filter, 'awayTeamGoals', 'homeTeamGoals'),
        totalDraws: this.getTotalDraws(filter, 'awayTeamGoals', 'homeTeamGoals'),
        totalLosses: this.getTotalLosses(filter, 'awayTeamGoals', 'homeTeamGoals'),
        goalsFavor: this.getGoalsFavor(filter, 'awayTeamGoals'),
        goalsOwn: this.getGoalsOwn(filter, 'homeTeamGoals'),
        goalsBalance: this.getGoalsBalance(filter, 'awayTeamGoals', 'homeTeamGoals'),
        efficiency: this.getEfficiency(filter, 'awayTeamGoals', 'homeTeamGoals'),
      };
    });
    return result as Ileaderboard[];
  };

  private makeObj = (home: Ileaderboard, away: Ileaderboard): Ileaderboard => {
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
    const byHomeTeam = await this.getAllByHomeTeam();
    const byAwayTeam = await this.getAllByAwayTeam();
    const result = teams.map((team) => {
      const homeTeam = byHomeTeam.find((teamH) => teamH.name === team.teamName) as Ileaderboard;
      const awayTeam = byAwayTeam.find((teamA) => teamA.name === team.teamName) as Ileaderboard;
      return this.makeObj(homeTeam, awayTeam);
    });
    return result as Ileaderboard[];
  };
}
