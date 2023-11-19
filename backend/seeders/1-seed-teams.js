"use strict";

const teams = [
  "Napoli",
  "Manchester United",
  "Real Madrid",
  "Barcelona",
  "Juventus",
  "Bayern Munich",
  "Chelsea",
  "Liverpool",
  "Paris Saint-Germain",
  "Arsenal",
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const teamObjects = teams.map((team, index) => ({
      team_name: team,
      teamImage: `/static/images/${index + 1}.png`, // I know its not perfect solution for naming, but practical one
    }));

    await queryInterface.bulkInsert("teams", teamObjects, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("teams", null, {});
  },
};
