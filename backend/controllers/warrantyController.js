const { Warranty, SerialNumber, Customer, Product, SaleItem } = require('../models');

// List all warranties (with optional filter by customer or status)
const getWarranties = async (req, res) => {
    try {
        const where = {};
        if (req.query.customer_id) where.customer_id = req.query.customer_id;
        if (req.query.status) where.status = req.query.status;

        const warranties = await Warranty.findAll({
            where,
            include: [
                Customer,
                SerialNumber,
                { model: SaleItem, include: [Product] }
            ],
            order: [['end_date', 'ASC']]
        });
        res.json(warranties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching warranties' });
    }
};

// Manually create a warranty (e.g. adding an imported unit)
const createWarranty = async (req, res) => {
    const { customer_id, serial_number_id, sale_item_id, start_date, end_date } = req.body;
    try {
        const warranty = await Warranty.create({
            customer_id,
            serial_number_id,
            sale_item_id,
            start_date,
            end_date,
            status: 'ACTIVE'
        });
        res.status(201).json(warranty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating warranty' });
    }
};

// Update warranty status
const updateWarranty = async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    try {
        const warranty = await Warranty.findByPk(id);
        if (!warranty) return res.status(404).json({ message: 'Warranty not found' });
        await warranty.update({ status, notes });
        res.json(warranty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating warranty' });
    }
};

// Get warranties for a specific customer
const getCustomerWarranties = async (req, res) => {
    const { customer_id } = req.params;
    try {
        const warranties = await Warranty.findAll({
            where: { customer_id },
            include: [SerialNumber, { model: SaleItem, include: [Product] }],
            order: [['end_date', 'ASC']]
        });
        res.json(warranties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching customer warranties' });
    }
};

// List serial numbers for a product
const getSerials = async (req, res) => {
    try {
        const where = { status: 'AVAILABLE' };
        if (req.query.product_id) where.product_id = req.query.product_id;
        const serials = await SerialNumber.findAll({ where });
        res.json(serials);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching serials' });
    }
};

// Add serial number(s) for a product
const addSerial = async (req, res) => {
    const { product_id, serial_codes } = req.body; // serial_codes is an array
    try {
        const created = await SerialNumber.bulkCreate(
            serial_codes.map(code => ({ product_id, serial_code: code, status: 'AVAILABLE' })),
            { ignoreDuplicates: true }
        );
        res.status(201).json(created);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding serial numbers' });
    }
};

module.exports = { getWarranties, createWarranty, updateWarranty, getCustomerWarranties, getSerials, addSerial };
