const bcrypt = require('bcryptjs');
const { User } = require('./models');
const sequelize = require('./config/db');

async function test() {
    try {
        await sequelize.authenticate();
        const email = 'samarthrshinde5050@gmail.com';
        const rawPassword = 'admin123';
        
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }
        
        const isMatch = await bcrypt.compare(rawPassword, user.password_hash);
        console.log(`Login test for ${email}: ${isMatch ? 'SUCCESS' : 'FAILURE'}`);
        
        const adminEmail = 'admin@unity.com';
        const adminUser = await User.findOne({ where: { email: adminEmail } });
        if (adminUser) {
            const isMatchAdmin = await bcrypt.compare(rawPassword, adminUser.password_hash);
            console.log(`Login test for ${adminEmail}: ${isMatchAdmin ? 'SUCCESS' : 'FAILURE'}`);
        }
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

test();
