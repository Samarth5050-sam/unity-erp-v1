const { sequelize, User, Supplier, Customer, Product, Sale, SaleItem } = require('./models');
const bcrypt = require('bcryptjs');

const categories = [
    { name: 'Televisions', images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80'] },
    { name: 'Refrigerators', images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'] },
    { name: 'Mobiles', images: ['https://images.unsplash.com/photo-1610945265078-386f3b58d86f?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'] },
    { name: 'Laptops', images: ['https://images.unsplash.com/photo-1593642632823-8f785667771b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1517336714460-d5ea9841f3e0?auto=format&fit=crop&w=800&q=80'] }
];

const brands = ['Samsung', 'LG', 'Sony', 'Apple', 'Dell', 'HP'];

async function resetDB() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        
        console.log('Force syncing database (Dropping all tables and recreating)...');
        await sequelize.sync({ force: true });
        
        console.log('Creating Admin User...');
        const salt = await bcrypt.genSalt(10);
        await User.create({
            name: 'System Admin',
            email: 'admin@unity.com',
            password_hash: await bcrypt.hash('admin123', salt),
            role: 'owner'
        });

        console.log('Creating Suppliers...');
        const suppliers = [];
        for (const brand of brands) {
            const supplier = await Supplier.create({
                name: `${brand} India`,
                phone: `1800-456-${Math.floor(Math.random() * 9000)}`,
                email: `sales@${brand.toLowerCase()}.in`,
                address: `Tech Park, Mumbai`,
                gstin: `27${Math.random().toString(36).substring(2, 12).toUpperCase()}`
            });
            suppliers.push(supplier);
        }

        console.log('Creating Customers...');
        const customerNames = ["Samarth", "Aditya", "Sagar", "Amit", "Raj", "Manoj"];
        for (const name of customerNames) {
            await Customer.create({
                name,
                phone: `9${Math.floor(Math.random() * 900000000)}`,
                email: `${name.toLowerCase()}@example.com`,
                address: 'Main St, City Center',
                loyalty_points: Math.floor(Math.random() * 500)
            });
        }

        console.log('Generating 250 Products for testing...');
        const productsToInsert = [];
        for (let i = 0; i < 250; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const brand = brands[Math.floor(Math.random() * brands.length)];
            const supplier = suppliers.find(s => s.name.startsWith(brand)) || suppliers[0];
            const modelNum = Math.floor(Math.random() * 9000) + 100;
            const purchase_price = Math.floor(Math.random() * 50000) + 5000;
            
            productsToInsert.push({
                product_name: `${brand} ${category.name.slice(0, -1)} Model ${modelNum}`,
                category: category.name,
                barcode: `ELC-${brand.slice(0, 3)}-${modelNum}-${i}`,
                purchase_price,
                selling_price: purchase_price + (purchase_price * 0.2), // 20% margin
                gst_percentage: 18,
                stock_quantity: Math.floor(Math.random() * 50) + 5, // At least 5 in stock so UI doesn't look empty
                has_serial_number: true,
                warranty_months: 12,
                image_url: category.images[Math.floor(Math.random() * category.images.length)],
                supplier_id: supplier.id
            });
        }
        await Product.bulkCreate(productsToInsert);

        console.log('Database successfully completely resets and seeded! You are good to go!');
        process.exit(0);
    } catch (e) {
        console.error('Failed to reset DB:', e);
        process.exit(1);
    }
}

resetDB();
