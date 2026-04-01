const { Supplier, Product } = require('../models');

const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll({
            include: [{ model: Product, attributes: ['id', 'product_name', 'category'] }]
        });
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching suppliers', error: error.message });
    }
};

const addSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.create(req.body);
        res.status(201).json(supplier);
    } catch (error) {
        res.status(400).json({ message: 'Error adding supplier', error: error.message });
    }
};

const updateSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        const supplier = await Supplier.findByPk(id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        await supplier.update(req.body);
        res.json(supplier);
    } catch (error) {
        res.status(400).json({ message: 'Error updating supplier', error: error.message });
    }
};

const deleteSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        const supplier = await Supplier.findByPk(id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        await supplier.destroy();
        res.json({ message: 'Supplier deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting supplier', error: error.message });
    }
};

module.exports = { getSuppliers, addSupplier, updateSupplier, deleteSupplier };

