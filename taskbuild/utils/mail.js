const { Resend } = require("resend");
const fs = require("fs");
require("dotenv").config();

const mailSettings = JSON.parse(fs.readFileSync("./utils/mailsettings.json", "utf-8"));


const resend = new Resend(mailSettings);

// Function to send a welcome email when a user signs up
exports.sendWelcomeEmail = async (email) => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Welcome to our platform!',
            html: '<p>Thank you for signing up. Welcome to our platform!</p>'
        });
        console.log('Welcome email sent successfully.');
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

// Function to send an enrollment confirmation email
exports.sendEnrollmentConfirmation = async (email, courseTitle) => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Enrollment Confirmation',
            html: `<p>You have successfully enrolled in the course: ${courseTitle}</p>`
        });
        console.log('Enrollment confirmation email sent successfully.');
    } catch (error) {
        console.error('Error sending enrollment confirmation email:', error);
    }
};
// Function to send a password reset email
exports.sendPasswordResetEmail = async (email, resetToken) => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Password Reset Request',
            html: `<p>You have requested to reset your password. Click <a href="http://localhost:5000/reset-password?token=${resetToken}">here</a> to reset your password.</p>`
        });
        console.log('Password reset email sent successfully.');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
};
// Function to send a password reset confirmation email
exports.sendPasswordResetConfirmation = async (email) => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Password Reset Confirmation',
            html: '<p>Your password has been successfully reset.</p>'
        });
        console.log('Password reset confirmation email sent successfully.');
    } catch (error) {
        console.error('Error sending password reset confirmation email:', error);
    }
};


