var express = require('express');
var router = express.Router();
var path = require('path');
var pdf = require('tea-school');
var fs = require('fs');
var moment = require('moment');
var utils = require('./utils');
var qrcode = require('qrcode');


/* GET home page. */
router.post('/einvoice', async function(req, res, next) {
    let invoice = req.body;
    let dto = invoice.facturaDTO
    const q = await qrcode.toDataURL(JSON.stringify({FileType: 1, Tin: dto.SellerTin, Id: dto.FacturaId}));

    const options = {
        htmlTemplatePath: path.resolve(__dirname, '../template.pug'),

        // Here you put an object according to https://github.com/sass/node-sass#options
        styleOptions: {
            file: path.resolve(__dirname, '../template.scss')
        },

        // Here you put an object according to https://pugjs.org/api/reference.html#options
        // You can add any additional key to be used as a variable in the template.
        htmlTemplateOptions: {
            status: invoice.status,
            facturaNo: dto.FacturaDoc.FacturaNo,
            facturaDate: moment(dto.FacturaDoc.FacturaDate).locale('ru').format('DD MMMM YYYY'),
            contractNo: dto.ContractDoc.ContractNo,
            contractDate: moment(dto.ContractDoc.ContractDate).locale('ru').format('DD MMMM YYYY'),
            seller: dto.Seller,
            buyer: dto.Buyer,
            productList: dto.ProductList.Products,
            invoice: invoice.facturaDTO,
            vatSum: dto.ProductList.Products ? dto.ProductList.Products.reduce((acc, v) => parseFloat(acc) + parseFloat(v.VatSum), 0) : 0,
            totalVatSum: dto.ProductList.Products ? dto.ProductList.Products.reduce((acc, v) => parseFloat(acc) + parseFloat(v.DeliverySumWithVat), 0) : 0,
            numberInWords: `${utils.numberInWords(dto.ProductList.Products ? dto.ProductList.Products.reduce((acc, v) => parseFloat(acc) + parseFloat(v.DeliverySumWithVat), 0) : 0)} сум`,
            qrcode: q
        },

        pdfOptions: {
            // Ignore `path` to get the PDF as buffer only
            // path: 'pdf-file.pdf',
            format: 'A4',
            printBackground: true
        },
        puppeteerOptions: {args: ['--no-sandbox', '--disable-setuid-sandbox']}        
    };
    const pdfBuffer = await pdf.generatePdf(options);
    res.send(pdfBuffer.toString('base64'))    
});

module.exports = router;
