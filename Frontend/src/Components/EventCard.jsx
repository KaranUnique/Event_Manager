import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  Calendar,
  MapPin,
  Ticket,
  Share2,
  Download,
  Edit,
  Trash2,
  Search,
  Heart,
  ArrowRight,
  FileText,
} from "lucide-react";

const EventCard = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(new Set());

  /* ---------------- FETCH EVENTS ---------------- */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:7120/event/getEvent");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data || []);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load events", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    const fav = localStorage.getItem("eventFavorites");
    if (fav) setFavorites(new Set(JSON.parse(fav)));
  }, []);

  /* ---------------- HELPERS ---------------- */
  const getId = (e, i) => e._id || e.id || i;

  const toggleFavorite = (id) => {
    const copy = new Set(favorites);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    setFavorites(copy);
    localStorage.setItem("eventFavorites", JSON.stringify([...copy]));
  };

  /* ---------------- ACTIONS ---------------- */
  const handleDelete = async (name) => {
    const res = await Swal.fire({
      title: "Delete Event?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    });

    if (!res.isConfirmed) return;

    try {
      await fetch(`http://localhost:7120/event/deleteEvent/${encodeURIComponent(name)}`, {
        method: "DELETE",
      });
      setEvents((prev) => prev.filter((e) => e.eventName !== name));
      Swal.fire("Deleted", "Event removed successfully", "success");
    } catch {
      Swal.fire("Error", "Failed to delete event", "error");
    }
  };

  const handleShare = async (event) => {
    const url = `${window.location.origin}/event/${event._id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: event.eventName, url });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(url);
    Swal.fire("Copied", "Event link copied", "success");
  };

  const handleDownloadPNG = async (id) => {
    const el = document.getElementById(`card-${id}`);
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2 });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `event-${id}.png`;
    link.click();
  };

  const handleDownloadPDF = async (event, id) => {
    const el = document.getElementById(`card-${id}`);
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2 });
    const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0);
    pdf.save(`${event.eventName}.pdf`);
  };

  /* ---------------- FILTER ---------------- */
  const filtered = events.filter(
    (e) =>
      e.eventName?.toLowerCase().includes(search.toLowerCase()) ||
      e.eventDescription?.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading events...
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      {/* Search */}
      <div className="max-w-7xl mx-auto mb-6 relative">
        <Search className="absolute left-3 top-3 text-gray-400" />
        <input
          className="w-full pl-10 py-3 rounded-xl bg-gray-800 border border-gray-700"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((event, i) => {
          const id = getId(event, i);
          const upcoming = new Date(event.startDate) > new Date();

          return (
            <div
              key={id}
              id={`card-${id}`}
              className="bg-gray-800/60 rounded-2xl border border-gray-700 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-blue-600/20 to-green-600/20">
                <div className="flex justify-between">
                  <h3 className="text-xl font-bold">{event.eventName}</h3>
                  <button onClick={() => toggleFavorite(id)}>
                    <Heart
                      className={
                        favorites.has(id)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                  {event.eventDescription}
                </p>
              </div>

              {/* Body */}
              <div className="p-5 flex-grow space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  {new Date(event.startDate).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  {event.venueName}
                </div>
                <div className="text-xl font-bold text-blue-400">
                  ${event.ticketPrice ?? 0}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 grid grid-cols-5 gap-2">
                <button onClick={() => handleShare(event)}><Share2 /></button>
                <button onClick={() => handleDownloadPNG(id)}><Download /></button>
                <button onClick={() => handleDownloadPDF(event, id)}><FileText /></button>
                <Link to={`/eventEdit/${event.eventName}`}><Edit /></Link>
                <button onClick={() => handleDelete(event.eventName)}><Trash2 /></button>
              </div>

              <button
                disabled={!upcoming}
                onClick={() => navigate(`/event/${id}`)}
                className={`m-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${
                  upcoming
                    ? "bg-gradient-to-r from-blue-600 to-green-600"
                    : "bg-gray-700 cursor-not-allowed"
                }`}
              >
                <Ticket />
                {upcoming ? "Book Now" : "Event Ended"}
                {upcoming && <ArrowRight />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventCard;
