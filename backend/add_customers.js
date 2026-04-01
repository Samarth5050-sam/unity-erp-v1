const { sequelize, Customer } = require('./models');

const addCustomers = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const customers = [
            { name: 'yashraj', phone: '9000000001', email: 'yashraj@example.com', address: 'Unknown' },
            { name: 'samarth', phone: '9000000002', email: 'samarth@example.com', address: 'Unknown' },
            { name: 'pranav', phone: '9000000003', email: 'pranav@example.com', address: 'Unknown' },
            { name: 'sagar', phone: '9000000004', email: 'sagar@example.com', address: 'Unknown' },
            { name: 'prathmesh', phone: '9000000005', email: 'prathmesh@example.com', address: 'Unknown' },
            { name: 'vedant', phone: '9000000006', email: 'vedant@example.com', address: 'Unknown' },
            { name: 'jagjeevan', phone: '9000000007', email: 'jagjeevan@example.com', address: 'Unknown' },
            { name: 'sarthak', phone: '9000000008', email: 'sarthak@example.com', address: 'Unknown' }
        ];

        for (const cust of customers) {
            // Capitalize first letter
            cust.name = cust.name.charAt(0).toUpperCase() + cust.name.slice(1);
            await Customer.findOrCreate({
                where: { name: cust.name },
                defaults: cust
            });
        }
        
        console.log('Customers added successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Failed to add customers:', err);
        process.exit(1);
    }
};

addCustomers();
