const fs = require('fs');
const path = require('path');
const { sequelize, Product, Supplier, Customer, Sale, SaleItem, Warranty } = require('./models');

const exportData = async () => {
    try {
        await sequelize.authenticate();
        
        const mockDir = path.join(__dirname, '../frontend/public/mock');
        if (!fs.existsSync(mockDir)) fs.mkdirSync(mockDir, { recursive: true });

        // Export Products
        const products = await Product.findAll();
        fs.writeFileSync(path.join(mockDir, 'products.json'), JSON.stringify(products));

        // Export Customers
        const customers = await Customer.findAll();
        fs.writeFileSync(path.join(mockDir, 'customers.json'), JSON.stringify(customers));

        // Export Suppliers
        const suppliers = await Supplier.findAll();
        fs.writeFileSync(path.join(mockDir, 'suppliers.json'), JSON.stringify(suppliers));

        // Export Warranties
        const warranties = await Warranty.findAll();
        fs.writeFileSync(path.join(mockDir, 'warranties.json'), JSON.stringify(warranties));

        // Export Sales with Items and Customers
        const sales = await Sale.findAll({
            include: [
                { model: SaleItem },
                { model: Customer }
            ],
            order: [['createdAt', 'DESC']]
        });
        fs.writeFileSync(path.join(mockDir, 'sales.json'), JSON.stringify(sales));

        console.log("Mock data successfully exported to frontend/public/mock/");
        process.exit(0);
    } catch (e) {
        console.error("Failed to export data", e);
        process.exit(1);
    }
};

exportData();
