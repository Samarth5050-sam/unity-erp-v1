const { sequelize, Product, Supplier, Customer, User } = require('./models');
const bcrypt = require('bcryptjs');

const categories = [
    { name: 'Televisions', images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6', 'https://images.unsplash.com/photo-1552975084-6e027cd345c2', 'https://images.unsplash.com/photo-1509281373149-e957c6296406', 'https://images.unsplash.com/photo-1461151351111-94943fbe0a5a'] },
    { name: 'Refrigerators', images: ['https://images.unsplash.com/photo-1571175443880-49e1d58b727d', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a', 'https://images.unsplash.com/photo-1615822161741-653634e2c905'] },
    { name: 'Mobiles', images: ['https://images.unsplash.com/photo-1610945265078-386f3b58d86f', 'https://images.unsplash.com/photo-1696446701796-da61225697cc', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97'] },
    { name: 'Laptops', images: ['https://images.unsplash.com/photo-1593642632823-8f785667771b', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9', 'https://images.unsplash.com/photo-1517336714460-d5ea9841f3e0'] },
    { name: 'Audio', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b', 'https://images.unsplash.com/photo-1583394838336-acd9929a5f91'] },
    { name: 'Washing Machines', images: ['https://images.unsplash.com/photo-1626806775351-538af81015f5', 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c'] },
    { name: 'Air Conditioners', images: ['https://images.unsplash.com/photo-1631541909061-70e737089182', 'https://images.unsplash.com/photo-1563806236-40742d488583'] }
];

const brands = ['Samsung', 'LG', 'Sony', 'Apple', 'Dell', 'HP', 'Whirlpool', 'Panasonic', 'Bosch', 'Dyson', 'JBL', 'Bose'];

const seedMega = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Ensure Suppliers Exist
        console.log('Ensuring suppliers...');
        const suppliers = [];
        for (const brand of brands) {
            const [supplier] = await Supplier.findOrCreate({
                where: { name: `${brand} India` },
                defaults: {
                    phone: `1800-${Math.floor(Math.random() * 900)}-${Math.floor(Math.random() * 900000)}`,
                    email: `sales@${brand.toLowerCase()}.in`,
                    address: `Tech Park, ${brand} Square, Mumbai`,
                    gstin: `27${Math.random().toString(36).substring(2, 12).toUpperCase()}`
                }
            });
            suppliers.push(supplier);
        }

        // 2. Seed Specific Customers
        console.log('Seeding specific customers...');
        const customerNames = ["Samarth", "Aditya", "Sagar", "Amit", "Sarthak", "Yashraj", "Jagajeevan"];
        for (const name of customerNames) {
            await Customer.findOrCreate({
                where: { phone: `9${Math.floor(Math.random() * 900000000)}` },
                defaults: {
                    name,
                    email: `${name.toLowerCase()}@example.com`,
                    address: 'Ishwarpur, Sangli',
                    loyalty_points: Math.floor(Math.random() * 1000)
                }
            });
        }

        // 3. Generate 500+ Products
        console.log('Generating 500+ products...');
        const productsCount = 520;
        const productsToInsert = [];

        for (let i = 0; i < productsCount; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const brand = brands[Math.floor(Math.random() * brands.length)];
            const supplier = suppliers.find(s => s.name.startsWith(brand)) || suppliers[0];
            
            const modelNum = Math.floor(Math.random() * 9000) + 100;
            const productName = `${brand} ${category.name.slice(0, -1)} Model ${modelNum}`;
            const barcode = `ELC-${brand.slice(0, 3)}-${modelNum}-${i}`;
            
            const purchase_price = Math.floor(Math.random() * 80000) + 5000;
            const selling_price = purchase_price + (purchase_price * 0.2); // 20% margin
            
            const imgUrl = `${category.images[Math.floor(Math.random() * category.images.length)]}?auto=format&fit=crop&w=800&q=80`;

            productsToInsert.push({
                product_name: productName,
                category: category.name,
                barcode,
                purchase_price,
                selling_price,
                gst_percentage: 18,
                stock_quantity: Math.floor(Math.random() * 50) + 1,
                has_serial_number: true,
                warranty_months: Math.random() > 0.5 ? 12 : 24,
                image_url: imgUrl,
                supplier_id: supplier.id
            });
        }

        // Bulk insert products (ignoring duplicates by barcode if needed, but here we just bulk create)
        await Product.bulkCreate(productsToInsert, { ignoreDuplicates: true });
        console.log(`Successfully seeded ${productsCount} products.`);

        console.log('Mega Seeding Complete!');
        process.exit(0);
    } catch (error) {
        console.error('Mega Seeding failed:', error);
        process.exit(1);
    }
};

seedMega();
