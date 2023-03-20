/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: '57409d12-ddad-4938-a37a-c17bc33aa4ba',
          email: 'gatete@gmail.com',
          role: 'seller',
          password:
            '$2a$10$5OSUvABuuOMC5aVqUOrO5.oX07qTeQBz/LX2EtifOrsT3gw2UuJzS', // 1234
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'dbc8fb75-2bd9-4e49-90d5-01ebdd4076e2',
          email: 'kylesjet1@gmail.com',
          password: '$2b$10$CmTI8plpPwMC74n4pnod3..JErxlHetqkQqrhTuiwqt9KXC1rV52W',
          role: 'buyer',
          token: 'tokenexample',
          createdAt: '2023-03-17T10:16:59.334Z',
          updatedAt: '2023-03-17T10:16:59.334Z'
        },
        {
          id: '80ccebd5-7907-4840-a6af-5a738e8f1d35',
          email: 'boris@gmail.com',
          role: 'seller',
          password:
            '$2a$10$5OSUvABuuOMC5aVqUOrO5.oX07qTeQBz/LX2EtifOrsT3gw2UuJzS', // 1234

          token: 'tokenexample',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],

      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
