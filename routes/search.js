const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {

    const query = req.query.query;


    const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading products file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        try {
        
            const products = JSON.parse(data);

            const filteredProducts = products.filter(product => {
                
                return product.product_title.toLowerCase().includes(query.toLowerCase()) ||
                       product.product_description.toLowerCase().includes(query.toLowerCase());
            });

            res.json(filteredProducts);
        } catch (error) {
            console.error('Error parsing products data:', error);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;
