const { User } = require('./models');
const sequelize = require('./config/db');

async function listUsers() {
    try {
        await sequelize.authenticate();
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role']
        });
        console.log('--- Existing Users ---');
        users.forEach(u => {
            console.log(`ID: ${u.id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error fetching users:', error);
        process.exit(1);
    }
}

listUsers();
