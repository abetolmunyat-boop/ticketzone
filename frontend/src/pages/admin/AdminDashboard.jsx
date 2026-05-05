import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, TrendingUp, Users, Calendar, X, Image as ImageIcon } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    venue: '',
    image: '',
    category: 'Music',
    basePrice: '',
    capacity: '',
    availableSeats: '',
    featured: false
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/events`);
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (editingEvent) {
        await axios.put(`${API_URL}/api/events/${editingEvent._id}`, formData, config);
      } else {
        await axios.post(`${API_URL}/api/events`, formData, config);
      }
      
      setIsModalOpen(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      alert('Error saving event');
    }
  };

  const deleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchEvents();
      } catch (err) {
        alert('Error deleting event');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="container py-20 text-center">Unauthorized</div>;
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10">
      <div className="container px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-secondary">Admin Console</h1>
            <p className="text-text-muted">Manage your events and view platform analytics</p>
          </div>
          <button 
            onClick={() => { setEditingEvent(null); setFormData({ title: '', description: '', date: '', location: '', venue: '', image: '', category: 'Music', basePrice: '', capacity: '', availableSeats: '', featured: false }); setIsModalOpen(true); }}
            className="btn btn-primary px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20"
          >
            <Plus size={20} /> Create Event
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-text-muted text-xs font-black uppercase tracking-wider mb-1">Revenue</h3>
            <p className="text-3xl font-black text-secondary">$12,450</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-text-muted text-xs font-black uppercase tracking-wider mb-1">Users</h3>
            <p className="text-3xl font-black text-secondary">1,204</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <Calendar size={24} />
            </div>
            <h3 className="text-text-muted text-xs font-black uppercase tracking-wider mb-1">Events</h3>
            <p className="text-3xl font-black text-secondary">{events.length}</p>
          </div>
        </div>

        {/* Event List */}
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-gray-50/50">
            <h2 className="text-xl font-bold">All Events</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-text-muted">Event</th>
                  <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-text-muted">Date</th>
                  <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-text-muted">Price</th>
                  <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-text-muted">Stock</th>
                  <th className="text-right p-6 text-xs font-bold uppercase tracking-wider text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={event.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-sm">{event.title}</p>
                          <p className="text-xs text-text-muted">{event.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-sm">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="p-6 text-sm font-bold">${event.basePrice}</td>
                    <td className="p-6">
                      <div className="w-full bg-gray-100 h-2 rounded-full max-w-[100px]">
                        <div 
                          className="bg-primary h-full rounded-full" 
                          style={{ width: `${(event.availableSeats / event.capacity) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-text-muted mt-1">{event.availableSeats} / {event.capacity}</p>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditingEvent(event); setFormData(event); setIsModalOpen(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteEvent(event._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-8 border-b border-border">
                <h2 className="text-2xl font-black">{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold">Event Title</label>
                    <input name="title" value={formData.title} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" required />
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 h-24" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">Date</label>
                    <input type="datetime-local" name="date" value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ''} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20">
                      <option>Music</option>
                      <option>Sports</option>
                      <option>Arts</option>
                      <option>Family</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">Venue</label>
                    <input name="venue" value={formData.venue} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">Location</label>
                    <input name="location" value={formData.location} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">Base Price ($)</label>
                    <input type="number" name="basePrice" value={formData.basePrice} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">Capacity</label>
                    <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" required />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold">Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                      <input name="image" value={formData.image} onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" required />
                    </div>
                  </div>

                  <div className="md:col-span-2 flex items-center gap-3 p-4 bg-primary/5 rounded-2xl">
                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-5 h-5 rounded accent-primary" />
                    <label className="font-bold text-sm">Feature this event on the home page carousel</label>
                  </div>
                </div>

                <div className="flex gap-4 mt-12">
                  <button type="submit" className="btn btn-primary flex-1 py-4 rounded-2xl font-bold text-lg">
                    {editingEvent ? 'Save Changes' : 'Create Event'}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-50 rounded-2xl font-bold text-secondary hover:bg-gray-100">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
