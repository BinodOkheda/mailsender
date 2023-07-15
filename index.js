const express = require("express");
const app = express();
const sgMail = require('@sendgrid/mail');
const cors = require("cors");



app.use(express.json())
app.use(cors())
require("dotenv").config()






// Set your SendGrid API key
const apiKey = process.env.sgAPI_key;



// Initialize SendGrid with your API key
sgMail.setApiKey(apiKey);


// Define a route to handle the form submission
app.post('/send-email', (req, res) => {
    console.log(req.body)
    const { countryCode,content, fullName, emailContact, phone, budget } = req.body;
  
    const senderEmail = emailContact;

    const email = {
      to: 'binodkhan1234567890@gmail.com',
      from: "jigsvadiyatar6557@gmail.com",
      subject:"Message from Puzzle Innovation WebSite customer wants to contect us.",
      text: `Name: ${fullName}\nEmail: ${emailContact}\nCountryCode:${countryCode}\nPhone:${phone}\nBudget: ${budget}\n\n Message: ${content}`
    };
  
    // Send the email
    sgMail
      .send(email)
      .then(() => {
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