const { Product } = require('./models');

const checkImages = async () => {
    try {
        const product = await Product.findOne({
            where: { category: 'TV' }
        });

        if (product && product.image_url) {
            console.log('PASS: Images detected. Example:', product.image_url);
        } else {
            console.log('FAIL: No image_url found for TV.');
            if (product) console.log('Product found:', product.toJSON());
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkImages();
