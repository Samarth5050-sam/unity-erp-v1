const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const isSqlite = process.env.DB_DIALECT === 'sqlite';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'postgres',
        storage: isSqlite ? process.env.DB_STORAGE : undefined,
        logging: false, // Set to console.log to see SQL queries
    }
);

module.exports = sequelize;
