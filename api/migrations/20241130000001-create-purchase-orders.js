'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      client_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      osg_pi_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      osg_pi_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      client_po_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      client_po_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      po_status: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      no_of_dispatch: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      client_address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      client_contact: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      dispatch_plan_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      site_location: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      osc_support: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      confirm_date_of_dispatch: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes
    await queryInterface.addIndex('purchase_orders', ['client_name']);
    await queryInterface.addIndex('purchase_orders', ['po_status']);
    await queryInterface.addIndex('purchase_orders', ['created_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('purchase_orders');
  },
};

