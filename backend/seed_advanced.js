const { sequelize, Product, Supplier, Customer, Sale, SaleItem, User, Warranty } = require('./models');

const seedAdvanced = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // FORCE SYNC to drop tables and recreate with new columns (image_url)
        await sequelize.sync({ force: true });
        console.log('Database synced (force: true).');

        // 1. Seed Suppliers
        const suppliersData = [
            { name: 'Samsung India Electronics', phone: '1800-40-7267864', email: 'support.india@samsung.com', address: 'DLF Centre, Sansad Marg, New Delhi', gstin: '07AAAAA0000A1Z5' },
            { name: 'LG Electronics India', phone: '1800-315-9999', email: 'service@lge.com', address: 'Plot No. 51, Udyog Vihar, Greater Noida', gstin: '09BBBBB1111B1Z6' },
            { name: 'Sony India Pvt Ltd', phone: '1800-103-7799', email: 'sonyindia.care@ap.sony.com', address: 'A-18, Mohan Cooperative Industrial Estate, New Delhi', gstin: '07CCCCC2222C1Z7' },
            { name: 'Apple Authorized Distributor', phone: '080-40455150', email: 'india_sales@apple.com', address: 'UB City, Vittal Mallya Road, Bangalore', gstin: '29DDDDD3333D1Z8' },
            { name: 'Dell India', phone: '1800-425-4002', email: 'sales@dell.com', address: 'Divyasree Greens, Domlur, Bangalore', gstin: '29EEEEE4444E1Z9' }
        ];

        const suppliersList = [];
        for (const s of suppliersData) {
            const supplier = await Supplier.create(s);
            suppliersList.push(supplier);
        }
        console.log('Suppliers seeded.');

        // 2. Seed Products
        const productsData = [
            // Televisions
            { product_name: 'Samsung 55" 4K QLED Smart TV', category: 'Televisions', barcode: 'SAM-TV-55Q60A', purchase_price: 65000, selling_price: 74990, gst_percentage: 18, stock_quantity: 15, supplier_id: suppliersList[0].id, warranty_months: 12, has_serial_number: true, image_url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80' },
            { product_name: 'LG 43" 4K UHD Smart LED TV', category: 'Televisions', barcode: 'LG-TV-43UQ75', purchase_price: 32000, selling_price: 38990, gst_percentage: 18, stock_quantity: 20, supplier_id: suppliersList[1].id, warranty_months: 12, has_serial_number: true, image_url: 'https://images.unsplash.com/photo-1552975084-6e027cd345c2?auto=format&fit=crop&w=800&q=80' },
            { product_name: 'Sony Bravia 65" XR Series Google TV', category: 'Televisions', barcode: 'SNY-TV-65X90K', purchase_price: 110000, selling_price: 129990, gst_percentage: 18, stock_quantity: 8, supplier_id: suppliersList[2].id, warranty_months: 24, has_serial_number: true, image_url: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80' },

            // Home Appliances
            { product_name: 'Samsung 653L Side-by-Side Refrigerator', category: 'Home Appliances', barcode: 'SAM-REF-RS72', purchase_price: 72000, selling_price: 84990, gst_percentage: 12, stock_quantity: 5, supplier_id: suppliersList[0].id, warranty_months: 120, has_serial_number: true, image_url: 'https://images.unsplash.com/photo-1571175443880-49e1d58b727d?auto=format&fit=crop&w=800&q=80' },
            { product_name: 'LG 8Kg Front Load Washing Machine', category: 'Home Appliances', barcode: 'LG-WM-FHP1208', purchase_price: 28000, selling_price: 34990, gst_percentage: 12, stock_quantity: 12, supplier_id: suppliersList[1].id, warranty_months: 36, has_serial_number: true, image_url: 'https://images.unsplash.com/photo-1626806775351-538af81015f5?auto=format&fit=crop&w=800&q=80' },

            // Mobiles
            { product_name: 'Samsung Galaxy S23 Ultra 256GB', category: 'Mobiles', barcode: 'SAM-S23U-BLK', purchase_price: 95000, selling_price: 104999, gst_percentage: 18, stock_quantity: 10, supplier_id: suppliersList[0].id, warranty_months: 12, has_serial_number: true, image_url: 'https://images.unsplash.com/photo-1610945265078-386f3b58d86f?auto=format&fit=crop&w=800&q=80' },
            { product_name: 'iPhone 15 Pro Max 256GB Titanium', category: 'Mobiles', barcode: 'APL-IP15PM-TI', purchase_price: 140000, selling_price: 159900, gst_percentage: 18, stock_quantity: 15, supplier_id: suppliersList[3].id, warranty_months: 12, has_serial_number: true, image_url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=800&q=80' },
            { product_name: 'iPhone 14 128GB Blue', category: 'Mobiles', barcode: 'APL-IP14-BLU', purchase_price: 55000, selling_price: 61999, gst_percentage: 18, stock_quantity: 25, supplier_id: suppliersList[3].id, warranty_months: 12, has_serial_number: true, image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80' },

            // Laptops
            { product_name: 'Dell XPS 13 Plus i7 16GB', category: 'Laptops', barcode: 'DEL-XPS-9320', purchase_price: 150000, selling_price: 174990, gst_percentage: 18, stock_quantity: 5, supplier_id: suppliersList[4].id, warranty_months: 36, has_serial_number: true, image_url: 'https://images.unsplash.com/photo-1593642632823-8f785667771b?auto=format&fit=crop&w=800&q=80' },
            { product_name: 'MacBook Air M2 8GB 256GB', category: 'Laptops', barcode: 'APL-MBA-M2', purchase_price: 85000, selling_price: 99900, gst_percentage: 18, stock_quantity: 8, supplier_id: suppliersList[3].id, warranty_months: 12, has_serial_number: true, image_url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80' }
        ];

        const productsList = [];
        for (const p of productsData) {
            const product = await Product.create(p);
            productsList.push(product);
        }
        console.log('Electronics products seeded.');

        // 3. Seed Customers
        const customersData = [
            { name: 'Rahul Sharma', phone: '9876543210', email: 'rahul.sharma@example.com', address: '12, MG Road, Bangalore', loyalty_points: 150 },
            { name: 'Priya Joshi', phone: '9988776655', email: 'priya.j@example.com', address: '45, Indiranagar, Bangalore', loyalty_points: 300 },
            { name: 'Amit Patel', phone: '9123456789', email: 'amit.patel@example.com', address: 'Sector 5, Salt Lake, Kolkata', loyalty_points: 50 },
            { name: 'Sneha Gupta', phone: '9551122334', email: 'sneha.g@example.com', address: 'A-201, Lodha Park, Mumbai', loyalty_points: 420 },
            { name: 'Walk-in Customer', phone: '0000000000', email: 'guest@unity.com', address: 'Local Store', loyalty_points: 0 }
        ];

        const customersList = [];
        for (const c of customersData) {
            const customer = await Customer.create(c);
            customersList.push(customer);
        }
        console.log('Customers seeded.');

        // 4. Seed Admin
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash('admin123', salt);
        await User.create({
            name: 'Samarth Rajendra Shinde',
            email: 'admin@unity.com',
            password_hash: password_hash,
            role: 'admin'
        });
        console.log('Admin user recreated.');

        // 5. Seed Initial Sales (Historical data for charts)
        console.log('Seeding historical sales data...');
        const monthsAgo = [3, 2, 1, 0]; // 3 months ago to now
        for (const monthOffset of monthsAgo) {
            const date = new Date();
            date.setMonth(date.getMonth() - monthOffset);

            // Create 2-3 sales per month
            for (let i = 0; i < 2; i++) {
                const customer = customersList[Math.floor(Math.random() * (customersList.length - 1))];
                const product = productsList[Math.floor(Math.random() * productsList.length)];
                const quantity = 1;
                const saleDate = new Date(date);
                saleDate.setDate(Math.floor(Math.random() * 28) + 1);

                const price = Number(product.selling_price);
                const gst = (price * product.gst_percentage) / 100;
                const total = price + gst;

                const sale = await Sale.create({
                    invoice_number: `INV-${saleDate.getTime()}-${i}`,
                    customer_id: customer.id,
                    total_amount: total,
                    gst_amount: gst,
                    discount: 0,
                    payment_method: ['cash', 'card', 'online'][Math.floor(Math.random() * 3)],
                    createdAt: saleDate,
                    updatedAt: saleDate
                });

                await SaleItem.create({
                    sale_id: sale.id,
                    product_id: product.id,
                    quantity,
                    price,
                    serial_number: `SN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
                });

                // Update stock
                await product.decrement('stock_quantity', { by: quantity });
            }
        }
        console.log('Historical sales data seeded.');

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding Advanced failed:', error);
        process.exit(1);
    }
};

seedAdvanced();
