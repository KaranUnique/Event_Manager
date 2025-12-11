import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const EventEdit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const [data, setData] = useState({
        eventName: "",
        eventDescription: "",
        eventCategory: "",
        startDate: "",
        endDate: "",
        venueName: "",
        venueAddress: "",
        organizerName: "",
        organizerContact: "",
        ticketPrice: "",
        ticketType: "",
        maxAttendees: ""
    });

    const api_url = `http://localhost:7120/event/getEvent/${params.eventName}`;

    useEffect(() => {
        fetch(api_url, { method: "GET" })
            .then((res) => res.json())
            .then((res) => {
                // Format dates for datetime-local input
                const formattedData = {
                    ...res,
                    startDate: res.startDate ? new Date(res.startDate).toISOString().slice(0, 16) : "",
                    endDate: res.endDate ? new Date(res.endDate).toISOString().slice(0, 16) : ""
                };
                setData(formattedData);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching event data:", err);
                setIsLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load event details',
                    background: '#1f2937',
                    color: '#fff'
                });
            });
    }, [params.eventName]);

    const validateForm = () => {
        const newErrors = {};
        
        // Event name validation
        if (!data.eventName.trim()) {
            newErrors.eventName = "Event name is required";
        } else if (data.eventName.length < 3) {
            newErrors.eventName = "Event name must be at least 3 characters";
        }
        
        // Category validation
        if (!data.eventCategory) {
            newErrors.eventCategory = "Please select a category";
        }
        
        // Description validation
        if (!data.eventDescription.trim()) {
            newErrors.eventDescription = "Description is required";
        } else if (data.eventDescription.length < 10) {
            newErrors.eventDescription = "Description must be at least 10 characters";
        }
        
        // Date validation
        if (!data.startDate) {
            newErrors.startDate = "Start date is required";
        }
        
        if (!data.endDate) {
            newErrors.endDate = "End date is required";
        }
        
        if (data.startDate && data.endDate) {
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            
            if (start > end) {
                newErrors.endDate = "End date must be after start date";
            }
        }
        
        // Venue validation
        if (!data.venueName.trim()) {
            newErrors.venueName = "Venue name is required";
        }
        
        if (!data.venueAddress.trim()) {
            newErrors.venueAddress = "Venue address is required";
        }
        
        // Organizer validation
        if (!data.organizerName.trim()) {
            newErrors.organizerName = "Organizer name is required";
        }
        
        if (!data.organizerContact.trim()) {
            newErrors.organizerContact = "Organizer contact is required";
        }
        
        // Ticket validation
        if (data.ticketPrice === "" || isNaN(data.ticketPrice)) {
            newErrors.ticketPrice = "Valid ticket price is required";
        } else if (parseFloat(data.ticketPrice) < 0) {
            newErrors.ticketPrice = "Ticket price cannot be negative";
        }
        
        if (!data.ticketType) {
            newErrors.ticketType = "Please select a ticket type";
        }
        
        if (data.maxAttendees === "" || isNaN(data.maxAttendees)) {
            newErrors.maxAttendees = "Valid number of attendees is required";
        } else if (parseInt(data.maxAttendees) <= 0) {
            newErrors.maxAttendees = "Maximum attendees must be greater than 0";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please correct the errors in the form',
                background: '#1f2937',
                color: '#fff',
                confirmButtonColor: '#ef4444'
            });
            return;
        }
        
        const update_url = `http://localhost:7120/event/updateEvent/${params.eventName}`;
        
        fetch(update_url, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'Failed to update event');
                    });
                }
                return response.json();
            })
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Event Updated',
                    text: 'Your event has been updated successfully!',
                    background: '#1f2937',
                    color: '#fff',
                    confirmButtonColor: '#4f46e5',
                    timer: 2000,
                    timerProgressBar: true
                }).then(() => {
                    navigate('/eventCard');
                });
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.message || 'Something went wrong while updating the event!',
                    background: '#1f2937',
                    color: '#fff',
                    confirmButtonColor: '#ef4444',
                });
                console.error('Error:', error);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const inputClasses = "w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";
    const errorInputClasses = "w-full bg-gray-800/50 border border-red-500 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all";
    const labelClasses = "block text-sm font-medium text-gray-300 mb-2";
    const errorLabelClasses = "block text-sm font-medium text-red-400 mb-2";
    const errorMessageClasses = "text-red-400 text-sm mt-1";

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[100px]"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="mb-8 flex items-center justify-between">
                    <Link 
                        to='/eventCard'
                        className="flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                        <span className="mr-2">←</span> Back to Events
                    </Link>
                </div>

                <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
                                Edit Event
                            </h1>
                            <p className="text-gray-400">
                                Update the details for <span className="text-white font-semibold">{data.eventName}</span>
                            </p>
                        </div>

                        <form onSubmit={handleSaveChanges} className="space-y-8">
                            {/* Basic Info Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-indigo-400 border-b border-gray-700 pb-2">Event Details</h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="col-span-2">
                                        <label className={errors.eventName ? errorLabelClasses : labelClasses}>Event Name</label>
                                        <input
                                            type="text"
                                            name="eventName"
                                            value={data.eventName}
                                            onChange={handleChange}
                                            className={errors.eventName ? errorInputClasses : inputClasses}
                                            placeholder="Enter event name"
                                        />
                                        {errors.eventName && <p className={errorMessageClasses}>{errors.eventName}</p>}
                                    </div>

                                    <div className="col-span-2">
                                        <label className={errors.eventDescription ? errorLabelClasses : labelClasses}>Description</label>
                                        <textarea
                                            name="eventDescription"
                                            value={data.eventDescription}
                                            onChange={handleChange}
                                            rows="4"
                                            className={`${errors.eventDescription ? errorInputClasses : inputClasses} resize-none`}
                                            placeholder="Describe your event..."
                                        />
                                        {errors.eventDescription && <p className={errorMessageClasses}>{errors.eventDescription}</p>}
                                    </div>

                                    <div>
                                        <label className={errors.eventCategory ? errorLabelClasses : labelClasses}>Category</label>
                                        <select
                                            name="eventCategory"
                                            value={data.eventCategory}
                                            onChange={handleChange}
                                            className={errors.eventCategory ? errorInputClasses : inputClasses}
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Conference">Conference</option>
                                            <option value="Workshop">Workshop</option>
                                            <option value="Concert">Concert</option>
                                            <option value="Meetup">Meetup</option>
                                            <option value="Exhibition">Exhibition</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {errors.eventCategory && <p className={errorMessageClasses}>{errors.eventCategory}</p>}
                                    </div>

                                    <div>
                                        <label className={errors.maxAttendees ? errorLabelClasses : labelClasses}>Max Attendees</label>
                                        <input
                                            type="number"
                                            name="maxAttendees"
                                            value={data.maxAttendees}
                                            onChange={handleChange}
                                            className={errors.maxAttendees ? errorInputClasses : inputClasses}
                                            placeholder="0"
                                        />
                                        {errors.maxAttendees && <p className={errorMessageClasses}>{errors.maxAttendees}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Date & Location Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-indigo-400 border-b border-gray-700 pb-2">Date & Location</h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={errors.startDate ? errorLabelClasses : labelClasses}>Start Date</label>
                                        <input
                                            type="datetime-local"
                                            name="startDate"
                                            value={data.startDate}
                                            onChange={handleChange}
                                            className={errors.startDate ? errorInputClasses : inputClasses}
                                        />
                                        {errors.startDate && <p className={errorMessageClasses}>{errors.startDate}</p>}
                                    </div>

                                    <div>
                                        <label className={errors.endDate ? errorLabelClasses : labelClasses}>End Date</label>
                                        <input
                                            type="datetime-local"
                                            name="endDate"
                                            value={data.endDate}
                                            onChange={handleChange}
                                            className={errors.endDate ? errorInputClasses : inputClasses}
                                        />
                                        {errors.endDate && <p className={errorMessageClasses}>{errors.endDate}</p>}
                                    </div>

                                    <div className="col-span-2">
                                        <label className={errors.venueName ? errorLabelClasses : labelClasses}>Venue Name</label>
                                        <input
                                            type="text"
                                            name="venueName"
                                            value={data.venueName}
                                            onChange={handleChange}
                                            className={errors.venueName ? errorInputClasses : inputClasses}
                                            placeholder="e.g. Grand Hall"
                                        />
                                        {errors.venueName && <p className={errorMessageClasses}>{errors.venueName}</p>}
                                    </div>

                                    <div className="col-span-2">
                                        <label className={errors.venueAddress ? errorLabelClasses : labelClasses}>Venue Address</label>
                                        <input
                                            type="text"
                                            name="venueAddress"
                                            value={data.venueAddress}
                                            onChange={handleChange}
                                            className={errors.venueAddress ? errorInputClasses : inputClasses}
                                            placeholder="Full address"
                                        />
                                        {errors.venueAddress && <p className={errorMessageClasses}>{errors.venueAddress}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Organizer & Ticket Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-indigo-400 border-b border-gray-700 pb-2">Organizer & Tickets</h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={errors.organizerName ? errorLabelClasses : labelClasses}>Organizer Name</label>
                                        <input
                                            type="text"
                                            name="organizerName"
                                            value={data.organizerName}
                                            onChange={handleChange}
                                            className={errors.organizerName ? errorInputClasses : inputClasses}
                                            placeholder="Name"
                                        />
                                        {errors.organizerName && <p className={errorMessageClasses}>{errors.organizerName}</p>}
                                    </div>

                                    <div>
                                        <label className={errors.organizerContact ? errorLabelClasses : labelClasses}>Contact Info</label>
                                        <input
                                            type="text"
                                            name="organizerContact"
                                            value={data.organizerContact}
                                            onChange={handleChange}
                                            className={errors.organizerContact ? errorInputClasses : inputClasses}
                                            placeholder="Email or Phone"
                                        />
                                        {errors.organizerContact && <p className={errorMessageClasses}>{errors.organizerContact}</p>}
                                    </div>

                                    <div>
                                        <label className={errors.ticketPrice ? errorLabelClasses : labelClasses}>Ticket Price ($)</label>
                                        <input
                                            type="number"
                                            name="ticketPrice"
                                            value={data.ticketPrice}
                                            onChange={handleChange}
                                            className={errors.ticketPrice ? errorInputClasses : inputClasses}
                                            placeholder="0.00"
                                        />
                                        {errors.ticketPrice && <p className={errorMessageClasses}>{errors.ticketPrice}</p>}
                                    </div>

                                    <div>
                                        <label className={errors.ticketType ? errorLabelClasses : labelClasses}>Ticket Type</label>
                                        <select
                                            name="ticketType"
                                            value={data.ticketType}
                                            onChange={handleChange}
                                            className={errors.ticketType ? errorInputClasses : inputClasses}
                                        >
                                            <option value="Free">Free</option>
                                            <option value="Paid">Paid</option>
                                            <option value="VIP">VIP</option>
                                        </select>
                                        {errors.ticketType && <p className={errorMessageClasses}>{errors.ticketType}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/eventCard')}
                                    className="flex-1 bg-gray-800 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-gray-700 transition-all duration-300 border border-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventEdit;