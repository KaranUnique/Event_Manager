import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../Services/api.js";
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  FileText,
  DollarSign,
  Building,
  User,
  Mail,
  ArrowLeft,
  Save,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const EventEdit = () => {
  const { eventName } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    maxAttendees: "",
  });

  const categories = [
    "Conference",
    "Workshop",
    "Concert",
    "Meetup",
    "Exhibition",
    "Other",
  ];

  /* ---------------- FETCH EVENT ---------------- */
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const url = api.url(`/event/getEvent/${encodeURIComponent(eventName)}`);
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch event");

        const result = await res.json();
        setData({
          ...result,
          startDate: result.startDate
            ? new Date(result.startDate).toISOString().slice(0, 16)
            : "",
          endDate: result.endDate
            ? new Date(result.endDate).toISOString().slice(0, 16)
            : "",
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load event details", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventName]);

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    const e = {};
    if (!data.eventName.trim()) e.eventName = "Event name is required";
    if (!data.eventCategory) e.eventCategory = "Category is required";
    if (!data.eventDescription.trim()) e.eventDescription = "Description is required";
    if (!data.startDate) e.startDate = "Start date required";
    if (!data.endDate) e.endDate = "End date required";
    if (!data.venueName) e.venueName = "Venue name required";
    if (!data.venueAddress) e.venueAddress = "Venue address required";
    if (!data.organizerName) e.organizerName = "Organizer name required";
    if (!data.organizerContact) e.organizerContact = "Organizer contact required";
    if (data.ticketPrice === "" || isNaN(data.ticketPrice))
      e.ticketPrice = "Valid price required";
    if (!data.ticketType) e.ticketType = "Ticket type required";
    if (!data.maxAttendees || isNaN(data.maxAttendees))
      e.maxAttendees = "Valid attendee count required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const url = api.url(`/event/updateEvent/${encodeURIComponent(eventName)}`);
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Update failed");

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Event updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/eventCard"), 2000);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  /* ---------------- LOADING ---------------- */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading event details...
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/eventCard" className="flex items-center gap-2 mb-6 text-gray-400 hover:text-white">
          <ArrowLeft /> Back
        </Link>

        <div className="text-center mb-8">
          <Sparkles className="mx-auto text-yellow-400" />
          <h1 className="text-4xl font-bold mt-2">Edit Event</h1>
          <p className="text-gray-400">{data.eventName}</p>
        </div>

        <form onSubmit={handleSave} className="bg-gray-800/60 p-6 rounded-2xl space-y-6">
          <input name="eventName" value={data.eventName} onChange={handleChange} className="input" />
          <textarea name="eventDescription" value={data.eventDescription} onChange={handleChange} className="input" />
          <select name="eventCategory" value={data.eventCategory} onChange={handleChange} className="input">
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <input type="datetime-local" name="startDate" value={data.startDate} onChange={handleChange} className="input" />
          <input type="datetime-local" name="endDate" value={data.endDate} onChange={handleChange} className="input" />

          <input name="venueName" value={data.venueName} onChange={handleChange} className="input" />
          <input name="venueAddress" value={data.venueAddress} onChange={handleChange} className="input" />

          <input name="organizerName" value={data.organizerName} onChange={handleChange} className="input" />
          <input name="organizerContact" value={data.organizerContact} onChange={handleChange} className="input" />

          <input type="number" name="ticketPrice" value={data.ticketPrice} onChange={handleChange} className="input" />
          <select name="ticketType" value={data.ticketType} onChange={handleChange} className="input">
            <option value="">Select Ticket Type</option>
            <option>Free</option>
            <option>Paid</option>
            <option>VIP</option>
          </select>

          <input type="number" name="maxAttendees" value={data.maxAttendees} onChange={handleChange} className="input" />

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/eventCard")}
              className="flex-1 bg-gray-700 py-3 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 py-3 rounded-xl font-bold"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventEdit;
