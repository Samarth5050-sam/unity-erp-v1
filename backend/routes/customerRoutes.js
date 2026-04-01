const express = require('express');
const router = express.Router();
const { getCustomers, addCustomer, getCustomerHistory } = require('../controllers/customerController');

router.get('/', getCustomers);
router.post('/', addCustomer);
router.get('/:id/history', getCustomerHistory);

module.exports = router;
