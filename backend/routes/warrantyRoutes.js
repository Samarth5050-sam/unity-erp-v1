const express = require('express');
const router = express.Router();
const {
    getWarranties,
    createWarranty,
    updateWarranty,
    getCustomerWarranties,
    getSerials,
    addSerial
} = require('../controllers/warrantyController');

router.get('/', getWarranties);
router.post('/', createWarranty);
router.put('/:id', updateWarranty);
router.get('/customer/:customer_id', getCustomerWarranties);

router.get('/serials', getSerials);
router.post('/serials', addSerial);

module.exports = router;
