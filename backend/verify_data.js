const { Product, Customer } = require('./models');

const verify = async () => {
    try {
        const productCount = await Product.count();
        const customerCount = await Customer.count();

        console.log(`Products in DB: ${productCount}`);
        console.log(`Customers in DB: ${customerCount}`);

        if (productCount < 200) {
            console.error('FAIL: Product count is less than 200');
            process.exit(1);
        }
        if (customerCount < 10) {
            console.error('FAIL: Customer count is less than 10');
            process.exit(1);
        }

        console.log('PASS: Data verification successful');
        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
};

verify();
