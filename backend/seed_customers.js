const sequelize = require('./config/db');
const { Customer } = require('./models');

const customerNames = [
    "samarth", "raj", "amit", "sagar", "aditya",
    "prathmesh", "sarthak", "jagjeevan", "pranav", "yashraj"
];

const seed = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        console.log('Seeding customers...');

        const customers = customerNames.map((name, index) => ({
            name: name,
            phone: `9${String(index).repeat(9)}`, // Dummy unique phone numbers 9000000000, 9111111111
            email: `${name.toLowerCase()}@example.com`,
            address: 'Locally',
            loyalty_points: 10 + index
        }));

        await Customer.bulkCreate(customers, { ignoreDuplicates: true });

        console.log('Customer seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding customers:', error);
        process.exit(1);
    }
};

seed();
