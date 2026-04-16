const { User } = require('./models');
const bcrypt = require('bcryptjs');
const sequelize = require('./config/db');

async function createUsers() {
    try {
        await sequelize.authenticate();
        
        const users = [
            { name: 'Admin User', email: 'admin@unity.com', password: 'admin123', role: 'admin' },
            { name: 'Regular User', email: 'user@unity.com', password: 'user123', role: 'user' }
        ];

        for (const u of users) {
            let existingUser = await User.findOne({ where: { email: u.email } });
            if (!existingUser) {
                const salt = await bcrypt.genSalt(10);
                const password_hash = await bcrypt.hash(u.password, salt);
                await User.create({
                    name: u.name,
                    email: u.email,
                    password_hash: password_hash,
                    role: u.role
                });
                console.log(`User ${u.email} created.`);
            } else {
                console.log(`User ${u.email} already exists. Updating password and role.`);
                const salt = await bcrypt.genSalt(10);
                const password_hash = await bcrypt.hash(u.password, salt);
                existingUser.password_hash = password_hash;
                existingUser.role = u.role;
                await existingUser.save();
            }
        }
        process.exit(0);
    } catch (error) {
        console.error('Error adding users:', error);
        process.exit(1);
    }
}

createUsers();
