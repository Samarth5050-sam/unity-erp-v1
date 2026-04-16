const { sequelize, Product, Customer, Supplier } = require('./models');

const ELECTRONIC_BRANDS = ['Samsung', 'LG', 'Sony', 'Panasonic', 'Bosch', 'Siemens', 'Whirlpool', 'Haier', 'Voltas', 'Daikin', 'Apple', 'Dell', 'HP', 'Lenovo', 'Asus'];
const CATEGORIES = ['Television', 'Refrigerator', 'Washing Machine', 'Air Conditioner', 'Microwave', 'Laptop', 'Mobile Phone', 'Tablet', 'Smartwatch', 'Audio'];
const ADJECTIVES = ['Pro', 'Ultra', 'Max', 'Plus', 'Smart', 'Elite', 'Premium', 'Advanced', 'Neo', 'Quantum', 'Inverter'];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateMegaProducts = () => {
    const products = [];
    let id_counter = 1000;
    
    for (const category of CATEGORIES) {
        for (let i = 1; i <= 100; i++) {
            const brand = getRandomItem(ELECTRONIC_BRANDS);
            const adjective = getRandomItem(ADJECTIVES);
            
            let name = `${brand} ${adjective} ${category} Model X${getRandomInt(10, 99)}`;
            let purchasePrice = getRandomInt(5000, 80000);
            
            if (category === 'Laptop' || category === 'Television') {
                purchasePrice = getRandomInt(40000, 150000);
            } else if (category === 'Smartwatch' || category === 'Audio') {
                purchasePrice = getRandomInt(1500, 15000);
            } else if (category === 'Mobile Phone') {
                purchasePrice = getRandomInt(10000, 120000);
            }

            const sellingPrice = Math.floor(purchasePrice * getRandomInt(115, 140) / 100); 

            products.push({
                product_name: name,
                category: category,
                barcode: `${brand.substring(0, 3)}-${category.substring(0, 3)}-${id_counter++}`.toUpperCase(),
                purchase_price: purchasePrice,
                selling_price: sellingPrice,
                stock_quantity: getRandomInt(5, 100),
                gst_percentage: 18,
                has_serial_number: true,
                image_url: `https://loremflickr.com/800/800/${category.toLowerCase().replace(' ', '')}?lock=${id_counter}`
            });
        }
    }
    return products;
};

const generateCustomers = () => {
    const names = ['Aarav Patel', 'Vihaan Sharma', 'Vivaan Kumar', 'Anaya Singh', 'Diya Gupta', 'Aditya Reddy', 'Riya Desai', 'Arjun Verma', 'Kavya Joshi', 'Sai Kapoor'];
    const customers = [];
    for(let i=0; i<20; i++) {
        customers.push({
            name: `${getRandomItem(names)} ${i}`,
            email: `customer${i}@example.com`,
            phone: `9876543${getRandomInt(100, 999)}`,
            address: `${getRandomInt(1, 999)} Main St, City`,
            state: 'Maharashtra',
            gstin: `27AAAAA0000A1Z${i % 9}`
        });
    }
    return customers;
};

const generateSuppliers = () => {
    const suppliers = [];
    for(const brand of ELECTRONIC_BRANDS) {
        suppliers.push({
            name: `${brand} India Pvt Ltd`,
            email: `contact@${brand.toLowerCase()}india.com`,
            phone: `1800-${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`,
            address: `${brand} Tower, Tech Park`,
            state: 'Delhi',
            gstin: `07BBBBB0000B1Z${getRandomInt(1, 9)}`
        });
    }
    return suppliers;
};

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected. Clearing old data...');

        // Optional: clear tables if you want fresh data. We will just add to them.
        
        console.log('Seeding Products (100 per category)...');
        const products = generateMegaProducts();
        for (const p of products) {
            await Product.create(p);
        }

        console.log('Seeding Customers...');
        for (const c of generateCustomers()) {
            await Customer.create(c);
        }

        console.log('Seeding Suppliers...');
        for (const s of generateSuppliers()) {
            await Supplier.create(s);
        }

        console.log('\nSuccessfully added MEGA real-time data!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
