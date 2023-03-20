/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Products',
      [
        {
          id: '4b35a4b0-53e8-48a4-97b0-9d3685d3197c',
          productName: 'Product 1',
          description: 'Description 1',
          quantity: 10,
          price: 700,
          images: ['https://picsum.photos/id/26/4209/2769'],
          seller_id: '57409d12-ddad-4938-a37a-c17bc33aa4ba',
          categoryName: 'Category1',
          expiryDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '926ade6c-21f7-4866-ae7f-360d1574839d',
          productName: 'Product 2',
          description: 'Description 2',
          quantity: 10,
          price: 1400,
          seller_id: '57409d12-ddad-4938-a37a-c17bc33aa4ba',
          images: ['https://picsum.photos/id/26/4209/2769'],
          categoryName: 'Category1',
          expiryDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  },
};