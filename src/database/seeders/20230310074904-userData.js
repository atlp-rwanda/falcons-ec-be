"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: "57409d12-ddad-4938-a37a-c17bc33aa4ba",
          email: "gatete@gmail.com",
          password:
            "$2a$10$5OSUvABuuOMC5aVqUOrO5.oX07qTeQBz/LX2EtifOrsT3gw2UuJzS", //1234
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "80ccebd5-7907-4840-a6af-5a738e8f1d35",
          email: "boris@gmail.com",
          password:
            "$2a$10$5OSUvABuuOMC5aVqUOrO5.oX07qTeQBz/LX2EtifOrsT3gw2UuJzS", //1234
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Users', null, {});
  },
};
