const { sequelize, User, Product, Customer, Supplier } = require('./models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync database (ensure tables exist - using true to override data)
        await sequelize.sync({ force: true });

        // 1. Create Admin
        const adminEmail = 'admin@unity.com';
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash('admin123', salt);
        await User.create({
            name: 'Unity Admin',
            email: adminEmail,
            password_hash: password_hash,
            role: 'admin'
        });
        
        // Ensure user samarth gets recreated too for the user's specific login if needed
        await User.create({
            name: 'Samarth Shinde',
            email: 'samarthrshinde5050@gmail.com',
            password_hash: password_hash,
            role: 'admin'
        });

        console.log('Admin users created.');

        // 2. Create Sample Supplier
        const [supplier] = await Supplier.findOrCreate({
            where: { email: 'contact@samsung.com' },
            defaults: {
                name: 'Global Electronics Hub',
                contact_person: 'Rajesh Kumar',
                phone: '9876543210',
                address: 'Mumbai, Maharashtra'
            }
        });
        console.log('Sample Supplier ensured.');

        // 3. Create Sample Customer
        await Customer.findOrCreate({
            where: { phone: '9988776655' },
            defaults: {
                name: 'Rahul Sharma',
                email: 'rahul@example.com',
                address: 'Pune, Maharashtra'
            }
        });
        console.log('Sample Customer ensured.');

        // 4. Create Appliances & Electronics
        const appliances = [
            {
                product_name: 'Apple iPhone 15 Pro, 256GB',
                category: 'Mobile',
                barcode: 'MOB-APL-15P',
                purchase_price: 120000,
                selling_price: 134900,
                stock_quantity: 18,
                gst_percentage: 18,
                has_serial_number: true,
                image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'Samsung Galaxy S24 Ultra',
                category: 'Mobile',
                barcode: 'MOB-SAM-S24U',
                purchase_price: 115000,
                selling_price: 129999,
                stock_quantity: 12,
                gst_percentage: 18,
                has_serial_number: true,
                image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'MacBook Pro 16" M3 Max',
                category: 'Laptop',
                barcode: 'LAP-APL-M3M',
                purchase_price: 280000,
                selling_price: 319900,
                stock_quantity: 5,
                gst_percentage: 18,
                has_serial_number: true,
                image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'Dell XPS 15 OLED',
                category: 'Laptop',
                barcode: 'LAP-DEL-XPS15',
                purchase_price: 140000,
                selling_price: 185000,
                stock_quantity: 8,
                gst_percentage: 18,
                has_serial_number: true,
                image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'LG 8kg Front Load Washing Machine',
                category: 'Washing Machine',
                barcode: 'WM-LG-FL-8KG',
                purchase_price: 28000,
                selling_price: 36500,
                stock_quantity: 15,
                gst_percentage: 18,
                has_serial_number: true,
                image_url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'Sony PlayStation 5 Console',
                category: 'Gaming',
                barcode: 'GAM-SONY-PS5',
                purchase_price: 45000,
                selling_price: 54990,
                stock_quantity: 20,
                gst_percentage: 18,
                has_serial_number: true,
                image_url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'Samsung 65" Neo QLED 8K Smart TV',
                category: 'Television',
                barcode: 'TV-SAM-65-8K',
                purchase_price: 180000,
                selling_price: 215000,
                stock_quantity: 4,
                gst_percentage: 18,
                has_serial_number: true,
                image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            }
        ];

        for (const app of appliances) {
            await Product.findOrCreate({
                where: { barcode: app.barcode },
                defaults: app
            });
        }
        console.log('Sample Appliances ensured.');

        console.log('\nSeeding Complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
