import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Ticket, Info, Star, ArrowLeft, Share2, Heart } from 'lucide-react';
import SeatingChart from '../components/SeatingChart';
import { motion } from 'framer-motion';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activeTab, setActiveTab] = useState('tickets');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${API_URL}/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSeatSelect = (seatId, price) => {
    setSelectedSeats(prev => {
      const exists = prev.find(s => s.id === seatId);
      if (exists) return prev.filter(s => s.id !== seatId);
      return [...prev, { id: seatId, price }];
    });
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const handleCheckout = () => {
    if (selectedSeats.length === 0) return;
    navigate(`/checkout/${id}`, { state: { selectedSeats, totalPrice } });
  };

  if (loading) return <div className="container py-20 text-center">Loading event details...</div>;
  if (!event) return <div className="container py-20 text-center">Event not found</div>;

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-24">
      {/* Header / Hero */}
      <div className="relative h-[400px] overflow-hidden bg-black">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-50 blur-sm scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] to-transparent" />
        
        <div className="container relative h-full flex flex-col justify-end px-4 pb-12">
          <button onClick={() => navigate(-1)} className="absolute top-8 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-4">{event.category}</span>
              <h1 className="text-4xl md:text-6xl font-black text-secondary mb-6 leading-tight">{event.title}</h1>
              <div className="flex flex-wrap gap-6 text-text-muted">
                <div className="flex items-center gap-2">
                  <Calendar className="text-primary" size={20} />
                  <span className="font-semibold">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-primary" size={20} />
                  <span className="font-semibold">{event.venue}, {event.location}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-text-muted hover:text-red-500">
                <Heart size={24} />
              </button>
              <button className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-text-muted hover:text-primary">
                <Share2 size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 mt-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
              {['tickets', 'info', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-secondary'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'tickets' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-xl font-bold mb-6">Select Your Seats</h3>
                <SeatingChart selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} />
              </motion.div>
            )}

            {activeTab === 'info' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose max-w-none">
                <h3 className="text-xl font-bold mb-4">About This Event</h3>
                <p className="text-text-muted leading-relaxed mb-6">{event.longDescription || event.description}</p>
                <div className="grid sm:grid-cols-2 gap-6 mt-8">
                  <div className="bg-white p-6 rounded-2xl border border-border">
                    <h4 className="font-bold mb-2 flex items-center gap-2"><Info size={18} className="text-primary" /> Venue Policy</h4>
                    <p className="text-sm text-text-muted">No professional cameras, bags must be transparent, doors open 2 hours before the show.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-border">
                    <h4 className="font-bold mb-2 flex items-center gap-2"><Star size={18} className="text-primary" /> Event Rating</h4>
                    <p className="text-sm text-text-muted">This event is rated for all ages. Parental guidance suggested for children under 12.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Attendee Reviews</h3>
                  <div className="flex items-center gap-2">
                    <Star className="text-amber-400 fill-amber-400" size={20} />
                    <span className="font-bold text-lg">4.8</span>
                    <span className="text-text-muted text-sm">(124 reviews)</span>
                  </div>
                </div>
                {/* Mock Review */}
                <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold">Sarah Johnson</h4>
                      <p className="text-xs text-text-muted">October 12, 2024</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                    </div>
                  </div>
                  <p className="text-text-muted text-sm italic">"Absolutely incredible experience! The seating was great and the sound quality was top notch. Definitely worth every penny."</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar / Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Ticket className="text-primary" size={20} /> 
                  Your Selection
                </h3>
                
                {selectedSeats.length > 0 ? (
                  <div className="space-y-4">
                    <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {selectedSeats.map(seat => (
                        <div key={seat.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                          <div>
                            <p className="text-sm font-bold text-secondary">Seat {seat.id.split('-').slice(1).join('')}</p>
                            <p className="text-xs text-text-muted">{seat.id.split('-')[0]}</p>
                          </div>
                          <span className="font-bold text-secondary">${seat.price}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-6 border-t-2 border-dashed border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-text-muted">Subtotal ({selectedSeats.length} tickets)</span>
                        <span className="font-bold">${totalPrice}</span>
                      </div>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-text-muted">Service Fee</span>
                        <span className="font-bold text-green-600">FREE</span>
                      </div>
                      <div className="flex justify-between items-center text-xl font-black text-secondary">
                        <span>Total</span>
                        <span>${totalPrice}</span>
                      </div>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      className="btn btn-primary w-full py-4 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 mt-4"
                    >
                      Continue to Checkout
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <Ticket size={32} />
                    </div>
                    <p className="text-text-muted text-sm">Please select your seats from the chart to proceed</p>
                  </div>
                )}
              </div>

              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                <p className="text-xs text-primary font-bold mb-2">SAFE & SECURE</p>
                <p className="text-sm text-secondary leading-relaxed">
                  Every ticket is 100% verified and guaranteed to be authentic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
