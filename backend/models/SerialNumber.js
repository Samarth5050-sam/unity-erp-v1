const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SerialNumber = sequelize.define('SerialNumber', {
    serial_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.ENUM('AVAILABLE', 'SOLD', 'DEFECTIVE', 'RETURNED'),
        defaultValue: 'AVAILABLE'
    },
    purchase_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = SerialNumber;
