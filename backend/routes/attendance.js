
const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const attendance = await Attendance.find().populate('studentId', 'name email');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new attendance request
router.post('/', async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    const newAttendance = await attendance.save();
    
    // Send email notification to warden
    const student = await User.findById(req.body.studentId);
    const warden = await User.findOne({ role: 'warden' });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: warden.email,
      subject: `New ${req.body.type} Request`,
      text: `Student ${student.name} has requested ${req.body.type} from ${req.body.startDate} to ${req.body.endDate}.\nReason: ${req.body.reason}`
    };
    
    await transporter.sendMail(mailOptions);
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update attendance status
router.patch('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate('studentId');
    attendance.status = req.body.status;
    const updatedAttendance = await attendance.save();
    
    // Send email notification to parent
    if (req.body.status === 'approved') {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: attendance.studentId.email, // Assuming parent's email is stored in student's email field
        subject: `${attendance.type} Request Approved`,
        text: `Your child's ${attendance.type} request from ${attendance.startDate} to ${attendance.endDate} has been approved.`
      };
      
      await transporter.sendMail(mailOptions);
    }
    
    res.json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
