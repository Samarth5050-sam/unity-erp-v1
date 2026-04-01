const { sequelize, Product } = require('./models');

const ELECTRONIC_BRANDS = ['Samsung', 'LG', 'Sony', 'Panasonic', 'Bosch', 'Siemens', 'Whirlpool', 'Haier', 'Voltas', 'Daikin', 'Apple', 'Dell', 'HP', 'Lenovo', 'Asus'];
const CATEGORIES = ['Television', 'Refrigerator', 'Washing Machine', 'Air Conditioner', 'Microwave', 'Laptop', 'Mobile Phone', 'Tablet', 'Smartwatch', 'Audio'];
const ADJECTIVES = ['Pro', 'Ultra', 'Max', 'Plus', 'Smart', 'Elite', 'Premium', 'Advanced', 'Neo', 'Quantum', 'Inverter'];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateProducts = () => {
    const products = [];
    for (let i = 1; i <= 100; i++) {
        const brand = getRandomItem(ELECTRONIC_BRANDS);
        const category = getRandomItem(CATEGORIES);
        const adjective = getRandomItem(ADJECTIVES);
        
        let name = `${brand} ${adjective} ${category} Series ${getRandomInt(100, 999)}`;
        let purchasePrice = getRandomInt(5000, 80000);
        
        if (category === 'Laptop' || category === 'Television') {
            purchasePrice *= 1.5;
        } else if (category === 'Smartwatch' || category === 'Audio') {
            purchasePrice = Math.floor(purchasePrice / 3);
        }

        const sellingPrice = Math.floor(purchasePrice * getRandomInt(115, 140) / 100); 

        products.push({
            product_name: name,
            category: category,
            barcode: `${brand.substring(0, 3)}-${category.substring(0, 3)}-${getRandomInt(10000, 99999)}`.toUpperCase(),
            purchase_price: purchasePrice,
            selling_price: sellingPrice,
            stock_quantity: getRandomInt(2, 50),
            gst_percentage: 18,
            has_serial_number: true,
            image_url: `https://loremflickr.com/800/800/${category.toLowerCase().replace(' ', '')}?lock=${i}`
        });
    }
    return products;
};

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected. Seeding 100 products...');

        const products = generateProducts();

        for (const p of products) {
            await Product.create(p);
        }

        console.log('\nSuccessfully added 100 real-time products!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
