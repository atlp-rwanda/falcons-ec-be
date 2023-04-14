/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Orders',
      [
        {
          id: '0ec3d632-a09e-42e5-abda-520fed82ef57',
          buyer_id: 'dbc8fb75-2bd9-4e49-90d5-01ebdd4076e2', // kylesjet1@gmail.com
          status: 'successfull',
          total: 2800.0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders', null, {});
  }
};
