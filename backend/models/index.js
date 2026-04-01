const sequelize = require('../config/db');
const User = require('./User');
const Product = require('./Product');
const Customer = require('./Customer');
const Supplier = require('./Supplier');
const Sale = require('./Sale');
const SaleItem = require('./SaleItem');
const Purchase = require('./Purchase');
const SerialNumber = require('./SerialNumber');
const Warranty = require('./Warranty');

// Associations

// Product - Supplier
Product.belongsTo(Supplier, { foreignKey: 'supplier_id' });
Supplier.hasMany(Product, { foreignKey: 'supplier_id' });

// Sale - Customer
Sale.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(Sale, { foreignKey: 'customer_id' });

// Sale - SaleItems
Sale.hasMany(SaleItem, { foreignKey: 'sale_id', onDelete: 'CASCADE' });
SaleItem.belongsTo(Sale, { foreignKey: 'sale_id' });

// SaleItem - Product
SaleItem.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(SaleItem, { foreignKey: 'product_id' });

// Purchase - Supplier
Purchase.belongsTo(Supplier, { foreignKey: 'supplier_id' });
Supplier.hasMany(Purchase, { foreignKey: 'supplier_id' });

// SerialNumber - Product
SerialNumber.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(SerialNumber, { foreignKey: 'product_id' });

// Warranty - Customer, SaleItem, SerialNumber
Warranty.belongsTo(Customer, { foreignKey: 'customer_id' });
Warranty.belongsTo(SaleItem, { foreignKey: 'sale_item_id' });
Warranty.belongsTo(SerialNumber, { foreignKey: 'serial_number_id' });
Customer.hasMany(Warranty, { foreignKey: 'customer_id' });

module.exports = {
    sequelize,
    User,
    Product,
    Customer,
    Supplier,
    Sale,
    SaleItem,
    Purchase,
    SerialNumber,
    Warranty
};

