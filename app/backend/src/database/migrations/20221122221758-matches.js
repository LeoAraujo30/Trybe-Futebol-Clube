'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matches', {
      id: { primaryKey: true, type: Sequelize.INTEGER, allowNull: false, autoIncrement: true },
      homeTeam: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'home_team',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: { model: 'teams', key: 'id' },
      },
      homeTeamGoals: { type: Sequelize.INTEGER, allowNull: false, field: 'home_team_goals' },
      awayTeam: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'away_team',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: { model: 'teams', key: 'id' },
      },
      awayTeamGoals: { type: Sequelize.INTEGER, allowNull: false, field: 'away_team_goals' },
      inProgress: { type: Sequelize.BOOLEAN, allowNull: false, field: 'in_progress' },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('matches');
  }
};
