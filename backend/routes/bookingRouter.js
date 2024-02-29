const express = require('express');
const router = express.Router();
const Booking = require('../model/book'); // Assuming you've created the Booking model

// POST route for booking a scan
router.post('/bookscan', async (req, res) => {
  try {
    const {userId, scanId, scanName, scanType, totalAmount } = req.body;
    
    // Create a new booking instance
    const newBooking = new Booking({
      userid: userId,
      scanid: scanId,
      scanname: scanName,
      scantype: scanType,
      totalamount: totalAmount,
      status: 'booked'
      // Add more fields as needed
    });

    // Save the booking to the database
    const savedBooking = await newBooking.save();
    console.log(savedBooking)

    // Respond with the saved booking data
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/allbookings', async (req, res) => {
    try {
      // Fetch all bookings from the database
      const allBookings = await Booking.find();
      
      // Respond with the array of bookings
      res.status(200).json(allBookings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
module.exports = router;
