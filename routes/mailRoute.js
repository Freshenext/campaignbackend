const express = require('express');
const mailer = require('nodemailer');
const Joi = require('joi');
const Router = express.Router();

const mailSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
})

const transporter = mailer.createTransport({
    host: 'localhost',
    port: 465,
    pool: true,
    auth: {
        user: 'admin@francis.center',
        pass: 'Okemail123!',
    },
    tls: {
        rejectUnauthorized: false,
    }
});

const sendMail = async (to, subject, message) => {
    return transporter.sendMail({
        from: 'admin@francis.center',
        to,
        subject,
        html: message,
    });
};

Router.post('/generateLead', async (req,res) => {
    const { error, value } = mailSchema.validate(req.fields);
    if(error){
        return res.status(400).json({
            error: true,
            message: `There was an error: ${error.details[0].message}`
        })
    }
    const { email, name } = value;

    let subject = `You have generated a new lead!`;
    let message = `You have generated a new lead from demo.sofiapulse.com:<br /><br />
    
    Name: ${name} <br />
    Email: ${email}
    `;

    await sendMail('joe@sofiapulse.com', subject, message);
    res.json({ success: true, message: 'Mail sent successfully.'});
});

module.exports = Router;