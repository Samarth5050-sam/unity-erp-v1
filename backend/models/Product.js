const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    has_serial_number: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    warranty_months: {
        type: DataTypes.INTEGER,
        defaultValue: 12 // Default 1 year warranty
    },
    barcode: {
        type: DataTypes.STRING,
        unique: true
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    purchase_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    selling_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    gst_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 18.00
    },
    supplier_id: {
        type: DataTypes.INTEGER,
        // References Supplier model, added in index.js
    }
}, {
    timestamps: true
});

module.exports = Product;
