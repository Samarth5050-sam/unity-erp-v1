const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tracking_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true // Can be null for guest checkout
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'),
        defaultValue: 'Pending'
    },
    payment_mode: {
        type: DataTypes.STRING,
        defaultValue: 'Cash on Delivery'
    },
    payment_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    shipping_address: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Order;
