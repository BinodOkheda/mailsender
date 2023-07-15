const express = require("express");
const app = express();
const multer = require('multer');
const sgMail = require('@sendgrid/mail');
const cors = require("cors");
const fs = require('fs');
const path =require("path")



app.use(express.json())
app.use(cors())
require("dotenv").config()


app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
   return cb(null, __dirname+'/uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    return cb(null, Date.now() + '-' +file.originalname)
  }
})

const upload = multer({ storage: storage })

// Set your SendGrid API key
const apiKey = process.env.sgAPI_key;



// Initialize SendGrid with your API key
sgMail.setApiKey(apiKey);


// Define a route to handle the form submission
app.post('/send-email', upload.single('attachment'), (req, res) => {
    const { countryCode,content, fullName, emailContact, phone, budget } = req.body;
  
    const senderEmail = emailContact;
    const attachment = req.file
    console.log(req.body);
    console.log(req.file)
    // res.send()
    // res.redirect("/")
    const email = {
      to: 'sales@puzzleinnovationz@gmail.com',
      from: "puzzleinnovationz6@gmail.com",
      subject:"Message from Puzzle Innovation WebSite customer wants to contect us.",
      text: `Name: ${fullName}\nEmail: ${emailContact}\nCountryCode:${countryCode}\nPhone:${phone}\nBudget: ${budget}\n\n Message: ${content}`,
      attachments: [
        {
         content: fs.readFileSync(attachment.path).toString('base64'),
          filename: attachment.originalname,
          type: attachment.mimetype,
          disposition: 'attachment',
        }]
    };
  
    // Send the email
    sgMail
      .send(email)
      .then(() => {
         // Delete the temporary uploaded file
        fs.unlinkSync(attachment.path);

        console.log('Email sent successfully!');
        res.send('Email sent successfully!');
      })
      .catch(error => {
        console.error('Error occurred while sending email:', error.toString());
        res.status(500).send('Error occurred while sending email');
      });
  });




app.listen(3000, () => {
  console.log('Server is running on port 3000');
});