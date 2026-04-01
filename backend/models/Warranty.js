const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Warranty = sequelize.define('Warranty', {
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'EXPIRED', 'CLAIMED', 'VOID'),
        defaultValue: 'ACTIVE'
    },
    notes: {
        type: DataTypes.TEXT
    }
});

module.exports = Warranty;
