const Event = require("../Models/Event.models");

// Get Event
const getEvent = async (req, res) => {
    try {
        const event = await Event.find();
        if (!event || event.length === 0) {
            return res.status(404).send("Event Not Found");
        }
        res.status(200).json(event); // Use json() for sending response as JSON
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

// Get Event by Name
const getEventByName = async (req, res) => {
    try {
        const event = await Event.findOne({ eventName: req.params.eventName });

        if (!event) {
            return res.status(404).send("Event Not Found");
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

// Create Event
const createEvent = async (req, res) => {
    try {
        const { eventName, eventCategory, eventDescription, startDate, endDate, venueName, venueAddress, organizerName, organizerContact, ticketPrice, ticketType, maxAttendees } = req.body;

        // Validate required fields
        if (!eventName || !eventCategory || !eventDescription || !startDate || !endDate || !venueName || !venueAddress || !organizerName || !organizerContact || ticketPrice === undefined || !ticketType || maxAttendees === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate data types and values
        if (typeof ticketPrice !== 'number' || ticketPrice < 0) {
            return res.status(400).json({ message: "Ticket price must be a non-negative number" });
        }

        if (typeof maxAttendees !== 'number' || maxAttendees <= 0) {
            return res.status(400).json({ message: "Maximum attendees must be a positive number" });
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }
        
        if (start > end) {
            return res.status(400).json({ message: "End date must be after start date" });
        }

        // Check if event with same name already exists
        const existingEvent = await Event.findOne({ eventName });
        if (existingEvent) {
            return res.status(400).json({ message: "An event with this name already exists" });
        }

        const event = new Event({ 
            eventName, 
            eventCategory, 
            eventDescription, 
            startDate, 
            endDate, 
            venueName, 
            venueAddress, 
            organizerName, 
            organizerContact, 
            ticketPrice, 
            ticketType, 
            maxAttendees 
        });

        const savedEvent = await event.save();
        res.status(201).json(savedEvent); // Send 201 for successful creation
    } catch (error) {
        console.error("Error creating event:", error);
        if (error.code === 11000) {
            // Duplicate key error
            return res.status(400).json({ message: "An event with this name already exists" });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update Event
const updateEvent = async (req, res) => {
    try {
        const findEvent = await Event.findOne({ eventName: req.params.eventName });

        if (!findEvent) {
            return res.status(404).json({ message: 'No Event found with that Name' });
        }

        // Validate incoming data
        const { startDate, endDate, ticketPrice, maxAttendees, ...otherFields } = req.body;
        
        // Validate dates if provided
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ message: "Invalid date format" });
            }
            
            if (start > end) {
                return res.status(400).json({ message: "End date must be after start date" });
            }
        }

        // Validate ticketPrice if provided
        if (ticketPrice !== undefined) {
            if (typeof ticketPrice !== 'number' || ticketPrice < 0) {
                return res.status(400).json({ message: "Ticket price must be a non-negative number" });
            }
        }

        // Validate maxAttendees if provided
        if (maxAttendees !== undefined) {
            if (typeof maxAttendees !== 'number' || maxAttendees <= 0) {
                return res.status(400).json({ message: "Maximum attendees must be a positive number" });
            }
        }

        // Use findOneAndUpdate for better update handling
        const upEvent = await Event.findOneAndUpdate(
            { eventName: req.params.eventName }, 
            { $set: req.body },
            { new: true } // Return the updated document
        );
        
        res.status(200).json({ message: "Event Updated Successfully", event: upEvent });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete Event
const deleteEvent = async (req, res) => {
    try {
        const findEvent = await Event.findOneAndDelete({ eventName: req.params.eventName });
        if (!findEvent) {
            return res.status(404).json({ message: 'No Event found with that Name' });
        }

        res.status(200).json({ message: "Event Deleted Successfully", event: findEvent });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getEvent, getEventByName, createEvent, updateEvent, deleteEvent };