const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = async (sale) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const fileName = `INV-${sale.invoice_number}.pdf`;
        const filePath = path.join(__dirname, '../public/invoices', fileName);
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        // Header
        doc.fillColor('#2563eb').fontSize(24).text('UNITY ELECTRONICS', { align: 'left' });
        doc.fillColor('#444444').fontSize(10).text('Ishwarpur, Tal.Walwa, Dist.Sangli, MH', { align: 'left' });
        doc.text('Prop: Samarth Rajendra Shinde | Tel: 9699374346', { align: 'left' });
        doc.moveDown();

        // Invoice Info
        doc.fillColor('#000000').fontSize(18).text('INVOICE', { align: 'right' });
        doc.fontSize(10).text(`Number: ${sale.invoice_number}`, { align: 'right' });
        doc.text(`Date: ${new Date(sale.createdAt).toLocaleDateString()}`, { align: 'right' });
        doc.moveDown();

        // Bill To
        doc.fontSize(12).text('BILL TO:', { underline: true });
        doc.fontSize(10).text(sale.Customer?.name || 'Walk-in Customer');
        doc.text(sale.Customer?.phone || '');
        doc.moveDown();

        // Table Header
        const tableTop = 250;
        doc.fontSize(10).text('Item', 50, tableTop);
        doc.text('Qty', 250, tableTop);
        doc.text('Price', 300, tableTop);
        doc.text('Total', 400, tableTop);

        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        let currentY = tableTop + 25;
        sale.SaleItems?.forEach(item => {
            doc.text(item.Product?.product_name || 'Electronics Item', 50, currentY);
            doc.text(item.quantity.toString(), 250, currentY);
            doc.text(`Rs. ${item.price}`, 300, currentY);
            doc.text(`Rs. ${Number(item.price) * item.quantity}`, 400, currentY);
            currentY += 20;
        });

        doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
        currentY += 15;

        // Totals
        doc.fontSize(14).text(`GRAND TOTAL: Rs. ${sale.total_amount}`, { align: 'right' });
        
        doc.end();

        stream.on('finish', () => resolve(fileName));
        stream.on('error', reject);
    });
};

module.exports = { generatePDF };
