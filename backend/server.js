const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const os = require('os');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize } = require('./models');

dotenv.config();

// Global Error Handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

app.set('io', io); // make it accessible in routes

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/invoices', express.static(path.join(__dirname, 'public/invoices')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));
app.use('/api/warranties', require('./routes/warrantyRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// WhatsApp Mock API
app.post('/api/whatsapp/send', (req, res) => {
    const { phone, message, type } = req.body;
    console.log(`[WhatsApp API - ${type || 'Message'}] Sent to ${phone}:\n${message}`);
    // Simulate API delay
    setTimeout(() => {
        res.json({ success: true, message: 'Message sent successfully via WhatsApp API', messageId: `WA_${Date.now()}` });
    }, 1500);
});

// Root Route
app.get('/', (req, res) => {
    res.send('Unity Electronics ERP API Running');
});

// Database Connection and Server Start
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync models (force: false to avoid data loss in prod, true for dev reset)
        await sequelize.sync({ force: false });

        io.on('connection', (socket) => {
            console.log('A client connected:', socket.id);
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });

        server.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Network access: http://${getLocalIp()}:${PORT}`);
        });

        server.on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
                console.error(`\n[FATAL ERROR] Port ${PORT} is already in use.`);
                console.error(`Please close any other applications using this port or change the PORT in your .env file.\n`);
                process.exit(1);
            } else {
                console.error('Server error:', e);
            }
        });

    } catch (error) {
        console.error('Unable to connect to the database or start server:', error);
        process.exit(1);
    }
};

startServer();
