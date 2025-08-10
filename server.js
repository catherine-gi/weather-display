// server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import axios from 'axios';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const baseUrl = 'https://imd-new-api.onrender.com/api/data/';

// Middleware
app.use(express.json());  // Parse JSON request body
app.use(cors());          // Enable CORS
app.use(morgan('dev'));   // Logging

function hashJson(obj) {
//   const sorted = sortObject(obj);
  const jsonString = JSON.stringify(obj);
  return crypto.createHash('sha256').update(jsonString).digest('hex');
}

// Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running 🚀' });
});

// Example API Route
app.get('/api/compareIfSame', async (req, res) => {
    try {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const formatDate = (date) => date.toISOString().split('T')[0];


        const todayStr = formatDate(today);
        const yesterdayStr = formatDate(yesterday);

        console.log(todayStr);
        console.log(yesterdayStr);

        const [todayResponse, yesterdayResponse] = await Promise.all([
        axios.get(`${baseUrl}${todayStr}`),
        axios.get(`${baseUrl}${yesterdayStr}`)
        ]);
        console.log(todayResponse.data)

        const hash1 = hashJson(todayResponse.data);
        const hash2 = hashJson(yesterdayResponse.data);
        //res.json({res:hash1===hash2});

        if(hash1===hash2){
            // CALL THE EMAIL FUNCTION FROM HERE!!!!
            sendEmail(
                'randommail@gmail.com',
                'Test Email from Node.js',
                'ALERT!!!!!!!!!! SENSOR NOT SENSORING :(.'
            );
            res.json({res:true});
        }
        else{
            res.json({res:false})
        }



    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }

    

    
});


// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
// Function to send email
export async function sendEmail(to, subject, text) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user:'fourxxxxgpuxxxxxx@gmail.com',
              pass:'xxxxxxxxx'
                // user: process.env.EMAIL_USER,
                // pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}