const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sale = sequelize.define('Sale', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    invoice_number: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    customer_id: {
        type: DataTypes.INTEGER,
        // References Customer
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    gst_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    payment_method: {
        type: DataTypes.ENUM('cash', 'card', 'upi'),
        defaultValue: 'cash'
    }
}, {
    timestamps: true // created_at is handled by timestamps
});

module.exports = Sale;
