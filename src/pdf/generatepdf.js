const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const pdfConfig = require('./pdfConfig');


async function generateInvoicePdf (req){
    const html = await fs.readFileSync(path.join(__dirname, './template/invoiceTemplate.html'), 'utf-8');
    const filename = "first" + '_invoice' + '.pdf';

    const transArry = [
        {
            trans_id : 123455676767,
            trans_amnt : 1000,
            trans_date : "11/3/2024",
            trans_mode : "Cash"
        },
        {
            trans_id : 756483628234,
            trans_amnt : 22000,
            trans_date : "10/3/2024",
            trans_mode : "Online/UPI"
        }
    ];
    let totalPayable = 30000;
    let totalPaid = 0;

    transArry.forEach(e => {
        totalPaid = totalPaid + e.trans_amnt;
    })

    let pending = totalPayable - totalPaid;

    const signatureData = fs.readFileSync('src/pdf/template/imageandmore/Snapchat-1430142826-removebg-preview (2).png');
    const signaturebase64 = "data:image/jpeg;base64," + signatureData.toString('base64');
    const symbolData = fs.readFileSync('src/pdf/template/imageandmore/logo_load_p.png');
    const symbolbase64 = "data:image/jpeg;base64," + symbolData.toString('base64');
    

    const obj = {
        email : "ajay@gmail.com",
        name : "Ajay Khambhayta",
        prodlist : transArry,
        pending,
        totalPaid,
        totalPayable,
        signaturebase64,
        symbolbase64
    }

    const document = {
        html: html,
        data: {
            products: obj,
        },
        path: 'src/pdf/docs/invoices/' + filename
    }

    let res = await pdf.create(document, pdfConfig.invoicePdfConfig);
    return res;
}

module.exports = {generateInvoicePdf};