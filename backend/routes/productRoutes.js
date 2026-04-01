const express = require('express');
const router = express.Router();
const { getProducts, getProductByBarcode, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/barcode/:barcode', getProductByBarcode);
router.post('/', addProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
