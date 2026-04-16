const sequelize = require('./config/db');
const Supplier = require('./models/Supplier'); // Assuming this exists

const suppliers = [
    { name: 'ElectroIndia Distributors', contact_person: 'Rajesh Kumar', phone: '9876500001', email: 'rajesh@electroindia.in', address: 'Mumbai, MH', gstin: '27AABCU9603R1ZX' },
    { name: 'Samsung India Pvt Ltd', contact_person: 'Kiran Desai', phone: '9876500002', email: 'kiran.d@samsung.com', address: 'Pune, MH', gstin: '27AAECC5042R1ZQ' },
    { name: 'LG Electronics Dist', contact_person: 'Vikram Singh', phone: '9876500003', email: 'vikram@lg.com', address: 'Delhi, DEL', gstin: '07BBDCC1234D1Z2' },
    { name: 'Voltas Supply Chain', contact_person: 'Anil Tata', phone: '9876500004', email: 'anil@voltas.com', address: 'Chennai, TN', gstin: '33AABCV1234E1Z3' },
    { name: 'Global Tech Imports', contact_person: 'Soham Patil', phone: '9876500005', email: 'soham@globaltech.com', address: 'Kolhapur, MH', gstin: '27AABCU1234F1Z4' }
];

const seedSuppliers = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        
        console.log('Seeding suppliers...');
        await Supplier.bulkCreate(suppliers, { ignoreDuplicates: true });
        console.log('Suppliers seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding suppliers:', error);
        process.exit(1);
    }
};

seedSuppliers();
