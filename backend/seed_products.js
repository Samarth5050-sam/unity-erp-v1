const { sequelize, Product, Supplier } = require('./models');

const seedProducts = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        await sequelize.sync({ force: false });

        // Get or create supplier
        const [supplier] = await Supplier.findOrCreate({
            where: { email: 'contact@samsung.com' },
            defaults: {
                name: 'Samsung Electronics India',
                contact_person: 'Rajesh Kumar',
                phone: '9876543210',
                address: 'Mumbai, Maharashtra'
            }
        });

        const products = [
            // ── MOBILE PHONES ─────────────────────────────────────
            {
                product_name: 'Samsung Galaxy S24 Ultra',
                category: 'Mobile Phone',
                barcode: 'MOB-SAM-S24-ULTRA',
                purchase_price: 95000,
                selling_price: 129999,
                stock_quantity: 15,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 12,
                image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'Apple iPhone 15 Pro Max',
                category: 'Mobile Phone',
                barcode: 'MOB-APL-IP15-PROMAX',
                purchase_price: 120000,
                selling_price: 159900,
                stock_quantity: 10,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 12,
                image_url: 'https://images.unsplash.com/photo-1696426023702-f77a67d16ef0?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'OnePlus 12 5G',
                category: 'Mobile Phone',
                barcode: 'MOB-OP-12-5G',
                purchase_price: 48000,
                selling_price: 64999,
                stock_quantity: 20,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 12,
                image_url: 'https://images.unsplash.com/photo-1587840171670-8b850147754e?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'Redmi Note 13 Pro',
                category: 'Mobile Phone',
                barcode: 'MOB-RDM-N13PRO',
                purchase_price: 18000,
                selling_price: 26999,
                stock_quantity: 30,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 12,
                image_url: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },

            // ── TELEVISIONS ────────────────────────────────────────
            {
                product_name: 'Samsung 65" QLED 4K Smart TV',
                category: 'Television',
                barcode: 'TV-SAM-65-QLED',
                purchase_price: 75000,
                selling_price: 109999,
                stock_quantity: 8,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 24,
                image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'LG OLED C3 55" 4K TV',
                category: 'Television',
                barcode: 'TV-LG-OLED-C3-55',
                purchase_price: 85000,
                selling_price: 119999,
                stock_quantity: 5,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 24,
                image_url: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'Sony Bravia 43" Full HD Smart TV',
                category: 'Television',
                barcode: 'TV-SONY-BRAVIA-43',
                purchase_price: 30000,
                selling_price: 42990,
                stock_quantity: 12,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 24,
                image_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },

            // ── AIR CONDITIONERS ───────────────────────────────────
            {
                product_name: 'Daikin 1.5 Ton 5 Star Inverter AC',
                category: 'Air Conditioner',
                barcode: 'AC-DAI-1.5T-5S',
                purchase_price: 35000,
                selling_price: 47990,
                stock_quantity: 10,
                gst_percentage: 28,
                has_serial_number: true,
                warranty_months: 60,
                image_url: 'https://images.unsplash.com/photo-1652630553820-bf45e571e8a9?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'Voltas 1 Ton 3 Star Split AC',
                category: 'Air Conditioner',
                barcode: 'AC-VOL-1T-3S',
                purchase_price: 22000,
                selling_price: 30990,
                stock_quantity: 15,
                gst_percentage: 28,
                has_serial_number: true,
                warranty_months: 60,
                image_url: 'https://images.unsplash.com/photo-1581275626024-9b0d49d5c48e?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },

            // ── REFRIGERATORS ──────────────────────────────────────
            {
                product_name: 'LG 340L Double Door Refrigerator',
                category: 'Refrigerator',
                barcode: 'REF-LG-DD-340',
                purchase_price: 25000,
                selling_price: 34990,
                stock_quantity: 8,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 60,
                image_url: 'https://images.unsplash.com/photo-1571175432230-01c24844d022?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'Samsung 253L Single Door Fridge',
                category: 'Refrigerator',
                barcode: 'REF-SAM-SD-253',
                purchase_price: 15000,
                selling_price: 21990,
                stock_quantity: 12,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 60,
                image_url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'Whirlpool 265L French Door Refrigerator',
                category: 'Refrigerator',
                barcode: 'REF-WHP-FD-265',
                purchase_price: 42000,
                selling_price: 58990,
                stock_quantity: 4,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 60,
                image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },

            // ── WASHING MACHINES ───────────────────────────────────
            {
                product_name: 'Samsung 8KG Front Load Washer',
                category: 'Washing Machine',
                barcode: 'WM-SAM-FL-8KG',
                purchase_price: 32000,
                selling_price: 44990,
                stock_quantity: 7,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 24,
                image_url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'LG 7KG Top Load Washing Machine',
                category: 'Washing Machine',
                barcode: 'WM-LG-TL-7KG',
                purchase_price: 18000,
                selling_price: 25490,
                stock_quantity: 10,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 24,
                image_url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },

            // ── LAPTOPS ────────────────────────────────────────────
            {
                product_name: 'Apple MacBook Pro 14" M3',
                category: 'Laptop',
                barcode: 'LAP-APL-MBP14-M3',
                purchase_price: 155000,
                selling_price: 199900,
                stock_quantity: 5,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 12,
                image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'Dell Inspiron 15 Core i7 Laptop',
                category: 'Laptop',
                barcode: 'LAP-DELL-INS15-I7',
                purchase_price: 52000,
                selling_price: 72990,
                stock_quantity: 8,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 12,
                image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'HP Pavilion Gaming Laptop RTX 4060',
                category: 'Laptop',
                barcode: 'LAP-HP-PAV-RTX4060',
                purchase_price: 68000,
                selling_price: 89990,
                stock_quantity: 6,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 12,
                image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },

            // ── AUDIO ──────────────────────────────────────────────
            {
                product_name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
                category: 'Audio',
                barcode: 'AUD-SONY-XM5',
                purchase_price: 21000,
                selling_price: 29990,
                stock_quantity: 20,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 12,
                image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'JBL Charge 5 Bluetooth Speaker',
                category: 'Audio',
                barcode: 'AUD-JBL-CHG5',
                purchase_price: 9000,
                selling_price: 13999,
                stock_quantity: 25,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 12,
                image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },

            // ── MICROWAVES ─────────────────────────────────────────
            {
                product_name: 'LG 28L Convection Microwave Oven',
                category: 'Microwave',
                barcode: 'MW-LG-CONV-28L',
                purchase_price: 12000,
                selling_price: 17990,
                stock_quantity: 10,
                gst_percentage: 18,
                has_serial_number: false,
                warranty_months: 12,
                image_url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },

            // ── FANS & SMALL APPLIANCES ────────────────────────────
            {
                product_name: 'Dyson V15 Detect Cordless Vacuum',
                category: 'Home Cleaning',
                barcode: 'VC-DYS-V15',
                purchase_price: 45000,
                selling_price: 59900,
                stock_quantity: 5,
                gst_percentage: 18,
                has_serial_number: true,
                warranty_months: 24,
                image_url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
            {
                product_name: 'Philips Air Fryer 4.1L HD9200',
                category: 'Kitchen Appliance',
                barcode: 'KIT-PHL-AF-4L',
                purchase_price: 5500,
                selling_price: 7999,
                stock_quantity: 18,
                gst_percentage: 18,
                has_serial_number: false,
                warranty_months: 24,
                image_url: 'https://images.unsplash.com/photo-1648788380609-2abe5cac1d56?auto=format&fit=crop&q=80&w=800',
                supplier_id: supplier.id
            },
        ];

        let created = 0;
        let updated = 0;

        for (const p of products) {
            const existing = await Product.findOne({ where: { barcode: p.barcode } });
            if (existing) {
                await existing.update({ image_url: p.image_url, ...p });
                updated++;
            } else {
                await Product.create(p);
                created++;
            }
        }

        console.log(`\n✅ Seeding Complete!`);
        console.log(`   → ${created} new products created`);
        console.log(`   → ${updated} existing products updated`);
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedProducts();
