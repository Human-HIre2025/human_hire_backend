const Appointment = require('../models/appointmentModel');
const sendEmail = require('../utils/sendEmail');

// Get all appointments
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get single appointment
exports.getAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Create appointment
exports.createAppointment = async (req, res) => {
    try {
        const { service, date, timeSlot, name, email, phone } = req.body;
        const appointment = new Appointment({
            service,
            date,
            timeSlot,
            name,
            email,
            phone
        });

        await appointment.save();

        // Prepare email to MASTER_EMAIL
        const notificationEmail = {
            from: process.env.EMAIL_SERVICE_ADMIN,
            to: process.env.MASTER_EMAIL,
            subject: `New Appointment Request: ${service}`,
            text: `
                New Appointment Request:
                Service: ${service}
                Date: ${date}
                Time Slot: ${timeSlot}
                Name: ${name}
                Email: ${email}
                Phone: ${phone}
            `,
            html: `
                <h2>New Appointment Request</h2>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Time Slot:</strong> ${timeSlot}</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
            `
        };

        // Send notification email
        await sendEmail(notificationEmail);

        res.status(201).json({
            success: true,
            data: appointment,
            message: 'Appointment created and notification sent successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Validation Error or Email Sending Failed',
            error: error.message
        });
    }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        await appointment.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};