const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: [true, 'Event name is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Event name must be at least 3 characters'],
        maxlength: [100, 'Event name cannot exceed 100 characters']
    },
    eventCategory: {
        type: String,
        required: [true, 'Event category is required'],
        enum: {
            values: ['Webinar', 'Workshop', 'Conference', 'Social Event', 'Concert', 'Meetup', 'Exhibition'],
            message: 'Please select a valid category'
        }
    },
    eventDescription: {
        type: String,
        required: [true, 'Event description is required'],
        minlength: [10, 'Event description must be at least 10 characters'],
        maxlength: [2000, 'Event description cannot exceed 2000 characters']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator: function(date) {
                return date instanceof Date && !isNaN(date);
            },
            message: 'Start date must be a valid date'
        }
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
        validate: {
            validator: function(date) {
                return date instanceof Date && !isNaN(date) && date >= this.startDate;
            },
            message: 'End date must be after start date'
        }
    },
    venueName: {
        type: String,
        required: [true, 'Venue name is required'],
        trim: true,
        minlength: [2, 'Venue name must be at least 2 characters'],
        maxlength: [100, 'Venue name cannot exceed 100 characters']
    },
    venueAddress: {
        type: String,
        required: [true, 'Venue address is required'],
        trim: true,
        minlength: [5, 'Venue address must be at least 5 characters'],
        maxlength: [200, 'Venue address cannot exceed 200 characters']
    },
    onlineEventLink: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^https?:\/\/.*/.test(v);
            },
            message: 'Online event link must be a valid URL'
        }
    },
    organizerName: {
        type: String,
        required: [true, 'Organizer name is required'],
        trim: true,
        minlength: [2, 'Organizer name must be at least 2 characters'],
        maxlength: [50, 'Organizer name cannot exceed 50 characters']
    },
    organizerContact: {
        type: String,
        required: [true, 'Organizer contact is required'],
        trim: true,
        validate: {
            validator: function(v) {
                // Allow email or phone number format
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v) || /^[0-9]{10}$/.test(v);
            },
            message: 'Organizer contact must be a valid email or 10-digit phone number'
        }
    },
    ticketPrice: {
        type: Number,
        required: [true, 'Ticket price is required'],
        min: [0, 'Ticket price cannot be negative'],
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: 'Ticket price cannot be negative'
        }
    },
    ticketType: {
        type: String,
        required: [true, 'Ticket type is required'],
        enum: {
            values: ['Free', 'Paid', 'Donation', 'VIP'],
            message: 'Please select a valid ticket type'
        }
    },
    maxAttendees: {
        type: Number,
        required: [true, 'Maximum attendees is required'],
        min: [1, 'Maximum attendees must be at least 1'],
        validate: {
            validator: function(v) {
                return Number.isInteger(v) && v > 0;
            },
            message: 'Maximum attendees must be a positive integer'
        }
    }
});

// Ensure endDate is after startDate
eventSchema.pre('save', function(next) {
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
        return next(new Error('End date must be after start date'));
    }
    next();
});

// Ensure endDate is after startDate for updates
eventSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    if (update.$set && update.$set.startDate && update.$set.endDate) {
        const start = new Date(update.$set.startDate);
        const end = new Date(update.$set.endDate);
        if (start > end) {
            return next(new Error('End date must be after start date'));
        }
    }
    next();
});

module.exports = mongoose.model('Event', eventSchema);