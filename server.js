const express = require('express');
const axios = require('axios');
const cors = require('cors');
// const dbConn = require('./lib/db');
// const dbConn = require('./lib/pg');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
var json2xls = require('json2xls');

const app = express();

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');  // Directory where files will be saved
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);  // Save the file initially with its original name
    }
  });

const upload = multer({ storage: storage });

const fs = require('fs');
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}


let transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: 'amberonboarding@gmail.com',
      pass: 'yvxuainfgzidwdhc'
    }
});

app.post('/api/main_form', (req,res) => {
    console.log(req.body);
    const sqlInsert = `
    INSERT INTO main_form (
        business_vertical, supplier_name, supplier_address, supplier_city, supplier_state, 
        supplier_postal, business_address, business_city, business_state, business_postal, 
        country, typeOfSupplier, bank_acc, bank_name, bank_ifsc, bank_acc_type, bank_swift, 
        bank_iban, email, contact, person_incharge, owner_name, supplier_type, 
        supplier_group, supplier_category, supplier_subcategory, currency, 
        companyIncorp, pancard, assessee, gst, vendorId
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const formData = [
    req.body.businessVertical,
    req.body.supplierName,
    req.body.supplierAddress,
    req.body.supplierCity,
    req.body.supplierState,
    req.body.supplierPostal,
    req.body.businessAddress,
    req.body.businessCity,
    req.body.businessState,
    req.body.businessPostal,
    req.body.countryOrigin, 
    req.body.typeOfSupplier,
    req.body.bankAccNumber,
    req.body.bankName,
    req.body.bankIFSC || null,
    req.body.bankAccType || null,
    req.body.bankSwift || null,
    req.body.iban || null,
    req.body.email,
    req.body.contact,
    req.body.personInCharge,
    req.body.owner,
    req.body.supplierType,
    req.body.supplierGroup,
    req.body.supplierGroup !== 'NA' ? req.body.supplierCategory : null,
    req.body.supplierGroup !== 'NA' ? req.body.supplierSubcategory : null,
    req.body.currency,
    req.body.companyIncorp || null,
    req.body.pancard,
    req.body.nameOfAssessee || null,
    req.body.gst,
    req.body.vendorID || null
];

    let mailOptions = {
        from : "amberonboarding@gmail.com",
        to: ["sharma.abhishek@ambergroupindia.com", "bhanu.prakash@ambergroupindia.com","sagar.chauhan@ambergroupindia.com", "Pallavroy@ambergroupindia.com", "Seema.rani@ambergroupindia.com","Raghvendra.yadav@ambergroupindia.com", "Anshu.gulia@ambergroupindia.com"],
        subject: "New Supplier onboarding request",
        html: `
        <p> A new submission has been made on ASOS.</p>
        <p> Please find the details below:</p>
        <br>
        <p><b>Business Vertical:</b> ${req.body.businessVertical}</p>
        <p><b>Supplier Name:</b> ${req.body.supplierName}</p>
        <p><b>Supplier Address:</b> ${req.body.supplierAddress}</p>
        <p><b>City:</b> ${req.body.supplierCity}</p>
        <p><b>State:</b> ${req.body.supplierState}</p>
        <p><b>Postal:</b> ${req.body.supplierPostal}</p>
        <p><b>Business Address:</b> ${req.body.businessAddresss}</p>
        <p><b>Business City:</b> ${req.body.businessCity}</p>
        <p><b>Business State:</b> ${req.body.businessState}</p>
        <p><b>Business Postal:</b> ${req.body.businessPostal}</p>
        <p><b>Country of Origin:</b> ${req.body.countryOrigin}</p>
        <p><b>Type of Supplier:</b> ${req.body.typeOfSupplier}</p>
        <p><b>Bank Account Number:</b> ${req.body.bankAccNumber}</p>
        <p><b>Bank Name:</b> ${req.body.bankName}</p>
        ${req.body.bankIFSC?`<p><b>Bank IFSC:</b> ${req.body.bankIFSC}</p>`:null}
        ${req.body.bankSwift?`<p><b>Bank Swift:</b> ${req.body.bankSwift}</p>`:null}
        ${req.body.iban?`<p><b>IBAN:</b> ${req.body.iban}</p>`:null}
        ${req.body.bankAccType?`<p><b>Bank Account Type:</b> ${req.body.bankAccType}</p>`:null}
        <p><b>Email:</b> ${req.body.email}</p>
        <p><b>Contact:</b> ${req.body.contact}</p>
        <p><b>Peron Incharge:</b> ${req.body.personInCharge}</p>
        <p><b>Owner:</b> ${req.body.owner}</p>  
        <p><b>Supplier Type:</b> ${req.body.supplierType}</p>
        <p><b>Supplier Group:</b> ${req.body.supplierGroup}</p>
        ${req.body.supplierGroup !== 'NA'?`<p><b>Supplier Category:</b> ${req.body.supplierCategory}</p>`:null}
        ${req.body.supplierGroup !== 'NA'?`<p><b>Supplier Subcategory:</b> ${req.body.supplierSubcategory}</p>`:null}
        <p><b>Pancard:</b> ${req.body.pancard}</p>
        <p><b>GST:</b> ${req.body.gst}</p>
        <p><b>Currency:</b> ${req.body.currency}</p>
        ${req.body.nameOfAssessee? `<p><b>Nature Of Assessee:</b> ${req.body.nameOfAssessee}</p>`:null}
        <br>
        <p>Please review and approve the above details.</p>
        <a href="https://amber-asos.vercel.app/final/53345/${req.body.typeOfSupplier}">Approve</a>
        `,
        attachments: [
            {
                filename: 'pancard.pdf',
                path: './uploads/Pancard.pdf',
            }
        ]
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).json('Error sending email');
        } else {
            console.log('Email sent: ', info.response);
            res.status(200).json('Email sent successfully');
        }
    })
})

app.post('/api/final_form/:vendor_id', (req, res) => {
    const vendorId = req.params.vendor_id;

    console.log(req.body);

    const sqlSelect = `
        SELECT *
        FROM main_form 
        WHERE vendorId = ?
    `;

    // dbConn.query(sqlSelect, [vendorId], (err, results) => {
    //     if (err) {
    //         console.error('Error fetching data:', err);
    //         return res.status(500).json({ error: 'Failed to fetch data from database' });
    //     }

    //     if (results.length === 0) {
    //         return res.status(404).json({ message: 'No data found for the given vendor_id' });
    //     }

        const xlsData = {
            "VENDOR ACCOUNT": "",
            "NAME": "Designx",
            "BUSINESS ADDRESS NAME": "Designx",
            "BUSINESS STREET": "Sector 1",
            "BUSINESS CITY": "Noida",
            "BUSINESS ZIP/POSTAL CODE": "242200",
            "BUSINESS STATE": "Noida",
            "BUSINESS COUNTRY/REGION": "India",
            "BUSINESS DISTRICT": "Noida",
            "COMPOSITI ON SCHEME": "NO",
            "CURRENCY": "INR",
            "DEFAULT DELIVERY MODE ID": req.body.deliveryMode,
            "DEFAULT DELIVERY TERMS CODE": req.body.deliveryTerms,
            "DEFAULT OFFSET ACCOUNT TYPE": "Ledger",
            "DEFAULT PAYMENT TERMS NAME": req.body.termOfPayment,
            "FOREIGN": "No",
            "GTA VENDOR": "No",
            "IS SUB CONTRACTOR": "No",
            "ISWITHHOLDING TAX CALCULATED": "Yes",
            "LANGUAGE ID": "en-IN",
            "NATURE OF ASSESSEE": "",
            "ON HOLD STATUS": "",
            "PAN NUMBER": "NFPVS6603N",
            "PAN STATUS": "Yes",
            "PRIMARY CONTACT PERSON": "Krishna Saxena",
            "PRIMARY CONTACT PHONE RECORD ID": "7985087022",
            "PRIMARY EMAIL ADDRESS": "krishnasaxena@gmail.com",
            "TDS GROUP": "",
            "VENDOR GROUP ID": req.body.vendorGroup,
            "WITHHOLDING TAX VENDOR TYPE": "Domestic",
            "DEFAULT VENDOR PAYMENT METHOD NAME": "",
            "BANK ACCOUNT": "11100031111",
            "BANK NAME": "Axis Bank",
            "BANK ACCOUNT NUMBER": "11100031111",
            "IFSC CODE": "IFSCCODE",
            "SWIFT CODE": "",
            "BUSINESS TAX INFO NAME": "Designx Pvt. Ltd",
            "BUSINESS GSTIN": "GSTIN",
            "IEC NUMBER": "",
            "CREATED COMPANY ID": "",
            "APPROVED": "",
            "AUDIT SCORE": "",
            "CIN SCORE": "",
            "FORM RC": "",
            "MSME": "Yes",
            "MSME NUMBER": "Attached",
            "PAN CARD": "Attached",
            "PARENT VENDOR": "",
            "STLL": "",
            "TIN": "",
            "TRC": "",
            "VENDOR SPECIFICATION": "",
            "Responsible Person": "Rajat"
        };

        // Convert JSON to XLSX format
        var xls = json2xls(xlsData);

        // Asynchronous file write
        fs.writeFile('./uploads/data.xlsx', xls, 'binary', (err) => {
            if (err) {
                console.error('Error saving Excel file:', err);
                return res.status(500).json({ error: 'Failed to save Excel file' });
            }

            // Send email after the file has been saved
            let mailOptions = {
                from: "amberonboarding@gmail.com",
                to: ["girishsaluja@ambergroupindia.com", "sandeepagarwal@ambergroupindia.com", "ashutosh@ambergroupindia.com"],
                subject: "New Supplier onboarding request",
                text: `A new supplier onboarding request has been submitted. Please find the attached excel.`,
                attachments: [
                    {
                        filename: 'data.xlsx',
                        path: './uploads/data.xlsx',
                    }
                ]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json('Error sending email');
                } else {
                    console.log('Email sent: ', info.response);
                    return res.status(200).json('Email sent successfully');
                }
            });
        });
    // });
});

app.post('/api/upload_file', upload.single('file'), (req, res) => {
    try{
    if (!req.file) {
      return res.status(400).json('No file uploaded.');
    }

    console.log('Filename:', req.body.filename);
    
    const fileExtension = path.extname(req.file.originalname);
    const newFilename = req.body.filename 
    ? `${req.body.filename}${fileExtension}` 
    : req.file.originalname;

  const oldPath = req.file.path;
  const newPath = path.join('uploads', newFilename);

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      return res.status(500).send('Error renaming file.');
    }

    res.status(200).json({
      message: 'File uploaded and renamed successfully!',
      filePath: newPath,
      additionalData: req.body
    });
  });
    }
    catch(err){
        console.error(err);
        res.status(500).send('Error uploading file');
    }
    // console.log("Uploaded");
    // console.log(req.body.filename);

  });

  app.get("/", function(req, res) {
    res.status(200).send("Running")
  })

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
      console.log('Server is running on port 8080');
  })