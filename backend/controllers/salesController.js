const { Sale, SaleItem, Product, Customer, sequelize, Warranty, SerialNumber } = require('../models');

const createSale = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { customer_id, items, discount, payment_method } = req.body;
        // items: [{ product_id, quantity }]

        let total_amount = 0;
        let gst_amount = 0;

        // generated invoice number (simple logic for now)
        const invoice_number = `INV-${Date.now()}`;

        const saleItemsData = [];
        const productMap = {};

        for (const item of items) {
            const product = await Product.findByPk(item.product_id, { transaction: t });
            if (!product) {
                throw new Error(`Product ID ${item.product_id} not found`);
            }
            if (product.stock_quantity < item.quantity) {
                throw new Error(`Insufficient stock for product ${product.product_name}`);
            }

            productMap[item.product_id] = product;

            // Calculate price
            const lineTotal = product.selling_price * item.quantity;
            total_amount += lineTotal;
            gst_amount += (lineTotal * product.gst_percentage) / 100;

            saleItemsData.push({
                product_id: item.product_id,
                quantity: item.quantity,
                price: product.selling_price,
                serial_number: item.serial_number // Pass from frontend
            });

            // Reduce Stock
            await product.update({ stock_quantity: product.stock_quantity - item.quantity }, { transaction: t });
        }

        const final_amount = total_amount + gst_amount - (discount || 0);

        const sale = await Sale.create({
            invoice_number,
            customer_id,
            total_amount: final_amount,
            gst_amount,
            discount,
            payment_method
        }, { transaction: t });

        // Add Items
        const itemsWithSaleId = saleItemsData.map(i => ({ ...i, sale_id: sale.id }));
        const createdItems = await SaleItem.bulkCreate(itemsWithSaleId, { transaction: t, returning: true });

        await t.commit();

        // Generate PDF and Send Email Notifications
        let fullSale; // Declare fullSale here to be accessible later
        try {
            const { generatePDF } = require('../services/invoiceGenerator');
            const { sendInvoiceEmail } = require('../services/emailService');
            
            fullSale = await Sale.findByPk(sale.id, { 
                include: [
                    { model: SaleItem, include: [Product] }, 
                    Customer 
                ] 
            });

            // Generate physical PDF file
            await generatePDF(fullSale);

            // Send Email (Optionally attach link)
            const ownerEmail = 'samarthrshinde5050@gmail.com';
            const customerEmail = fullSale.Customer?.email;

            const emailSubject = `Unity Electronics - Invoice ${invoice_number}`;
            const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 20px;">
                        <h1 style="color: #3b82f6; color: #3b82f6; margin: 0;">UNITY ELECTRONICS</h1>
                        <p style="text-transform: uppercase; font-size: 12px; color: #666; margin: 5px 0;">Premium ERP Workstation</p>
                    </div>
                    
                    <h2 style="color: #333;">New Invoice Generated</h2>
                    <p><strong>Invoice Number:</strong> ${invoice_number}</p>
                    <p><strong>Customer:</strong> ${fullSale.Customer?.name || 'Walk-in'}</p>
                    <p><strong>Total Amount:</strong> ₹${final_amount.toLocaleString()}</p>
                    
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; font-size: 14px; color: #475569;">Summary</h3>
                        <p style="font-size: 13px; margin: 5px 0;">Subtotal: ₹${total_amount.toLocaleString()}</p>
                        <p style="font-size: 13px; margin: 5px 0;">GST (18%): ₹${gst_amount.toLocaleString()}</p>
                        <p style="font-size: 13px; margin: 5px 0; font-weight: bold; color: #1e293b;">Total: ₹${final_amount.toLocaleString()}</p>
                    </div>

                    <p style="font-size: 13px; color: #64748b;">A PDF copy of this invoice has been generated in the workstation database.</p>
                </div>
            `;

            // Mail to Owner
            await sendInvoiceEmail(ownerEmail, `OWNER: New Sale - ${invoice_number}`, `A new sale of ₹${final_amount} was made.`, emailHtml);
            
            // Mail to Customer if they have an email
            if (customerEmail && customerEmail !== 'guest@unity.com') {
                await sendInvoiceEmail(customerEmail, emailSubject, `Thank you for your purchase at Unity Electronics.`, emailHtml);
            }
        } catch (mailErr) {
            console.warn('Email notification failed (non-fatal):', mailErr.message);
        }

        // Auto-create warranty records for each item with warranty
        try {
            for (const saleItem of createdItems) {
                const product = productMap[saleItem.product_id];
                if (product && product.warranty_months > 0) {
                    const startDate = new Date();
                    const endDate = new Date();
                    endDate.setMonth(endDate.getMonth() + product.warranty_months);

                    // Also try to find a SerialNumber record to link if it exists
                    let serialNumberId = null;
                    if (saleItem.serial_number) {
                        // const { SerialNumber } = require('../models');
                        const snRecord = await SerialNumber.findOne({ where: { serial_code: saleItem.serial_number } });
                        if (snRecord) {
                            serialNumberId = snRecord.id;
                            await snRecord.update({ status: 'SOLD' });
                        }
                    }

                    await Warranty.create({
                        customer_id,
                        sale_item_id: saleItem.id,
                        serial_number_id: serialNumberId,
                        start_date: startDate,
                        end_date: endDate,
                        status: 'ACTIVE',
                        notes: saleItem.serial_number ? `Serial: ${saleItem.serial_number}` : ''
                    });
                }
            }
        } catch (wErr) {
            console.warn('Warranty auto-creation failed (non-fatal):', wErr.message);
        }

        // Fetch full sale data if not already fetched in the notifications block
        if (!fullSale) {
            fullSale = await Sale.findByPk(sale.id, {
                include: [SaleItem, Customer]
            });
        }

        res.status(201).json(fullSale);

    } catch (error) {
        await t.rollback();
        res.status(400).json({ message: 'Transaction failed', error: error.message });
    }
};

const getSales = async (req, res) => {
    try {
        // const { SaleItem, Customer } = require('../models');
        const sales = await Sale.findAll({
            include: [Customer, SaleItem],
            order: [['createdAt', 'DESC']]
        });
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sales', error: error.message });
    }
};

module.exports = { createSale, getSales };
