// Synergia Event Booking API

import express from "express";
import connectDB from "./config/db.js";
import Booking from "./models/Booking.js";

const app = express();
const PORT = 3000;

// CORS Middleware - Allow all origins (for development/testing)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

// Middleware to parse JSON
app.use(express.json());

// Middleware to ensure DB connection for each request (serverless-friendly)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });
    }
});

app.get("/",(req,res)=>{
    res.send("Welcome to Synergia Event Booking API");
});

// GET /api/bookings - Get all event bookings
app.get("/api/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});

// POST /api/bookings - Create a new booking
app.post("/api/bookings", async (req, res) => {
    try {
        console.log("POST /api/bookings - Request body:", req.body);
        
        const { name, email, event, ticketType } = req.body;

        // Validate required fields
        if (!name || !email || !event) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email, and event"
            });
        }

        // Create new booking
        const newBooking = await Booking.create({
            name,
            email,
            event,
            ticketType
        });

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: newBooking
        });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});

// GET /api/bookings/:id - Get booking by ID
app.get("/api/bookings/:id", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: `Booking with ID ${req.params.id} not found`
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});

// PUT /api/bookings/:id - Update participant details
app.put("/api/bookings/:id", async (req, res) => {
    try {
        const { name, email, event, ticketType } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: `Booking with ID ${req.params.id} not found`
            });
        }

        // Update only provided fields
        if (name) booking.name = name;
        if (email) booking.email = email;
        if (event) booking.event = event;
        if (ticketType) booking.ticketType = ticketType;

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});

// DELETE /api/bookings/:id - Cancel a booking
app.delete("/api/bookings/:id", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: `Booking with ID ${req.params.id} not found`
            });
        }

        await Booking.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});

// GET /api/bookings/search?email=xyz - Search booking by email
app.get("/api/bookings/search", async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide email query parameter"
            });
        }

        const bookings = await Booking.find({ 
            email: { $regex: email, $options: 'i' } 
        });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});

// GET /api/bookings/filter?event=Synergia - Filter bookings by event
app.get("/api/bookings/filter", async (req, res) => {
    try {
        const { event } = req.query;

        if (!event) {
            return res.status(400).json({
                success: false,
                message: "Please provide event query parameter"
            });
        }

        const bookings = await Booking.find({ 
            event: { $regex: event, $options: 'i' } 
        });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Export for Vercel serverless function
export default app;

// import express from 'express';
// import dotenv from 'dotenv';
// import {connectDB} from './config/db.js';
// import Booking from './models/Booking.js';


// dotenv.config();

// const router = express();
// const port = process.env.PORT || 3000;
// router.use(express.json());

// let serverStarted = false;

// connectDB();

// router.get('/', (req, res) => {
//   res.send('Welcome to the Synergia Event Booking API');
// });
//  router.get('/bookings', async (req, res) => {
//     try {
//         const bookings = await Booking.find();
//         res.status(200).json({
//             success: true,
//             count: bookings.length,
//             data: bookings
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server Error",
//             error: error.message
//         });
//     }

    
// });


// router.post('/bookings', async (req, res) => {
//     try {
//         const { name, email, event, ticketType } = req.body;

//         // Validate required fields
//         if (!name || !email || !event) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please provide name, email, and event"
//             });
//         }

//         // Create new booking
//         const newBooking = await Booking.create({
//             name,
//             email,
//             event,
//             ticketType
//         });

//         res.status(201).json({
//             success: true,
//             message: "Booking created successfully",
//             data: newBooking
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server Error",
//             error: error.message
//         });
//     }
// });

// router.put('/bookings/:id', async (req, res) => {
//   try {
//         const { name, email, event } = req.body;

//         const booking = await Booking.findById(req.params.id);

       

//         // Update only provided fields
//         if (name) booking.name = name;
//         if (email) booking.email = email;
//         if (event) booking.event = event;

//         await booking.save();

//         res.status(200).json({
//             success: true,
//             message: "Booking updated successfully",
//             data: booking
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server Error",
//             error: error.message
//         });
//     }
// });


// router.delete('/bookings/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const removed = await Booking.findByIdAndDelete(id);
//     if (!removed) return res.status(404).json({ message: 'Booking not found' });
//     res.status(204).send();
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: 'Invalid booking id' });
//   }
// });

// router.get('/bookings/search', async (req, res) => {
//   try {
//     const { email } = req.query;
//     if (!email) return res.status(400).json({ message: 'email query parameter required' });
//     const bookings = await Booking.find({ email: { $regex: email, $options: 'i' } });
//     res.status(200).json(bookings);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.get('/bookings/filter', async (req, res) => {
//   try {
//     const { event } = req.query;
//     if (!event) return res.status(400).json({ message: 'event query parameter required' });
//     const bookings = await Booking.find({ event: { $regex: event, $options: 'i' } });
//     res.status(200).json(bookings);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.listen(port, () => {
//   console.log(`Express server running at http://localhost:${port}`);
// });
// import express from 'express';
// import mongoose from 'mongoose';
// import connectDB from './config/db.js';
// const app = express();
// const port = 3000;
// app.use(express.json());

// connectDB();
// app.get('/',(req,res)=>{
//     res.send('Welcome to the Student Management API');
// });


// app.listen(port,()=>{
//     console.log(`Express server running at http://localhost:${port}`);
//     connectDB();
// });

// let students=[
//     {
//         id:1,
//         name:"alice",
//         age:20,
//         course:"cs" ,
//         grade:"a",
//         email:"alice@emample.com",
//     },
//     {
//         id:2,
//         name:"bob",
//         age:22,
//         course:"ee",
//         grade:"b",
//         email:"bob@eample.com"
//     }
//     ,{
//         id:3,
//         name:"charlie",
//         age:23,
//         course:"me",
//         grade:"b",
//         email:"charlie@example.com"
//     }
// ]

// app.post('/students',(req,res)=>{
//     const {name,age,course,grade,email}=req.body;
//     if(!name||!age||!course||!grade||!email){
//         return res.status(400).json({message:"All fields are req"});

//     }
//     const newStudent ={
//         id:students.length+1,
//         name,
//         age,
//         course,
//         grade,
//         email
//     };
//     students.push(newStudent);
//     res.status(201).json({message:"student added",student:newStudent});
// });

// app.get('/students',(req,res)=>{
//     res.status(200).json(students);
// });
// app.put('/students/:name',(req,res)=>{
//     const index=students.findIndex((s)=>s.name==req.params.name);

//     if(index===-1){
//         return res.status(404).json({message:"student not found"});

//     }
//   const {name,age,course,grade,email}=req.body;
//     students[index]={
//         ...students[index],
//           name,
//         age,
//         course,
//         grade,
//         email
//     }
//     res.status(200).json({message:"student updated",student:students[index]});
// })
// app.delete('/students/:name',(req,res)=>{
//     const name=req.params.name;
//     const index=students.findIndex((s)=>s.name===name);
//     if (index===-1){
//         return res.status(404).json({message:"student not found"});
//     }
//     students.splice(index,1);
//     res.status(200).json({message:"student deleted"});
// });


