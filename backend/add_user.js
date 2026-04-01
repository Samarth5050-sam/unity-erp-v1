const { User } = require('./models');
const bcrypt = require('bcryptjs');
const sequelize = require('./config/db');

async function addUser() {
    try {
        await sequelize.authenticate();
        
        const email = 'samarthrshinde5050@gmail.com';
        const password = 'admin123';
        
        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('User already exists.');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        await User.create({
            name: 'Samarth Shinde',
            email: email,
            password_hash: password_hash,
            role: 'admin'
        });

        console.log(`User ${email} created successfully with password ${password}`);
        process.exit(0);
    } catch (error) {
        console.error('Error adding user:', error);
        process.exit(1);
    }
}

addUser();
