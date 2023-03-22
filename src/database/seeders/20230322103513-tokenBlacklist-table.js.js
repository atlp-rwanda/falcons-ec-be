'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('BlacklistTokens',
      [{
        UserId: '80ccebd5-7907-4840-a6af-5a738e8f1d35',
        id: '80ccebd5-7907-4840-a6af-5a738e8f1d35',
        token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiODBjY2ViZDUtNzkwNy00ODQwLWE2YWYtNWE3MzhlOGYxZDM1IiwiZW1haWwiOiJib3Jpc0BnbWFpbC5jb20iLCJyb2xlIjoic2VsbGVyIn0sImlhdCI6MTY3OTQ3OTU5NSwiZXhwIjoxNjgwMDg0Mzk1fQ.ybNIEgNODcOQXeb2e7k9zhrozZOWd6Jn89q-NOtiVKs',
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),

      }], {});
  
  },

  async down (queryInterface, Sequelize) {

     await queryInterface.bulkDelete('BlacklistTokens', null, {});
     
  }
};
