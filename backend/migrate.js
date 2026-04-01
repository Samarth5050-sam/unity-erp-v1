// One-time migration: adds new columns to Products table
const sequelize = require('./config/db');

const migrate = async () => {
    try {
        await sequelize.authenticate();

        // Add columns if they don't exist (SQLite ALTER TABLE workaround)
        const qi = sequelize.getQueryInterface();

        const tableDesc = await qi.describeTable('Products');

        if (!tableDesc.has_serial_number) {
            await qi.addColumn('Products', 'has_serial_number', {
                type: require('sequelize').DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: true
            });
            console.log('Added has_serial_number column.');
        } else {
            console.log('has_serial_number already exists.');
        }

        if (!tableDesc.warranty_months) {
            await qi.addColumn('Products', 'warranty_months', {
                type: require('sequelize').DataTypes.INTEGER,
                defaultValue: 12,
                allowNull: true
            });
            console.log('Added warranty_months column.');
        } else {
            console.log('warranty_months already exists.');
        }

        if (!tableDesc.image_url) {
            await qi.addColumn('Products', 'image_url', {
                type: require('sequelize').DataTypes.STRING,
                allowNull: true
            });
            console.log('Added image_url column.');
        } else {
            console.log('image_url already exists.');
        }

        // Add serial_number to SaleItems
        const saleItemDesc = await qi.describeTable('SaleItems').catch(() => null);
        if (saleItemDesc && !saleItemDesc.serial_number) {
            await qi.addColumn('SaleItems', 'serial_number', {
                type: require('sequelize').DataTypes.STRING,
                allowNull: true
            });
            console.log('Added serial_number column to SaleItems.');
        }

        // Also ensure Suppliers has gstin
        const supplierDesc = await qi.describeTable('Suppliers').catch(() => null);
        if (supplierDesc && !supplierDesc.gstin) {
            await qi.addColumn('Suppliers', 'gstin', {
                type: require('sequelize').DataTypes.STRING,
                allowNull: true
            });
            console.log('Added gstin column to Suppliers.');
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
};

migrate();
