const express = require('express');
const nodeMailer = require('nodemailer');
const http = require('http');
const path = require('path');
const { resolveSoa } = require('dns');
const { urlencoded } = require('express');
require('dotenv').config();

var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.mail_id,
        pass: process.env.mail_pass
    }
});

const app = express().use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname+'/public')));

app.get('/', (req,res) => {
    res.sendFile('index.html');
});

app.post('/sendmail', (req,res) => {

    console.table(req.body);

    const mailOptions = {
        from: process.env.mail_id,
        to: req.body.mailId,
        subject: req.body.subject,
        text: req.body.mailBody
    };

    transporter.sendMail(mailOptions, (err,info) => {
        if(err)
            res.json(err);
        else
            res.json('Mail Sent to --> '+req.body.mailId);
    
        console.log(info.response);
    })
});

const port = 3000;
app.listen(port, ()=> {
    console.log(`Server ready at ${port}`);
});