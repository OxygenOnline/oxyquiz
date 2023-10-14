'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      id: 1001,
      username: "OxygenOnline",
      password: "SafePassword",
      email: "oxygenonline@gmail.com",
      joining_date: Sequelize.fn("NOW")
    },
    {
      id: 1002,
      username: "habuma",
      password: "Password",
      email: "habuma@gmail.com",
      joining_date: Sequelize.fn("NOW")
    },
    {
      id: 1003,
      username: "new_user123",
      password: "dontremember",
      email: "anewemail@gmail.com",
      joining_date: Sequelize.fn("NOW")
    },
    {
      id: 1004,
      username: "blobblob001",
      password: "myPasswordIsSafer123",
      email: "blobblob001@gmail.com",
      joining_date: Sequelize.fn("NOW")
    }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
