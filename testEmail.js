import { sendEmail } from './server.js';

sendEmail(
    'randommail@gmail.com',
    'Test Email from Node.js',
    'Hello! This is a test email sent from my Node.js script.'
);
