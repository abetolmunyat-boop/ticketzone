import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, TrendingUp, Users, Calendar, X, Image as ImageIcon, Clock, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const emptyForm = {
    title: '', description: '', date: '', location: '',
    venue: '', image: '', category: 'Music',
    basePrice: '', capacity: '', availableSeats: '', featured: false
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { fetchEvents(); }, []);

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

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
      location: event.location || '',
      venue: event.venue || '',
      image: event.image || '',
      category: event.category || 'Music',
      basePrice: event.basePrice || '',
      capacity: event.capacity || '',
      availableSeats: event.availableSeats || '',
      featured: event.featured || false,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
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
      alert('Error saving event. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this event?')) return;
    setDeleting(id);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) {
      alert('Error deleting event.');
    } finally {
      setDeleting(null);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>🚫</div>
          <h2 style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: '700' }}>Unauthorized</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>You must be an admin to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div className="container px-4">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--secondary)' }}>Admin Console</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage events, pricing, dates and platform analytics</p>
          </div>
          <button onClick={openCreateModal} className="btn btn-primary" style={{ borderRadius: '1rem', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', boxShadow: '0 8px 20px -8px var(--primary)' }}>
            <Plus size={20} /> Create Event
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {[
            { icon: <TrendingUp size={22} />, label: 'Revenue', value: '$12,450', color: '#16a34a', bg: '#dcfce7' },
            { icon: <Users size={22} />, label: 'Users', value: '1,204', color: '#2563eb', bg: '#dbeafe' },
            { icon: <Calendar size={22} />, label: 'Events', value: events.length, color: '#9333ea', bg: '#f3e8ff' },
          ].map((s) => (
            <div key={s.label} style={{ background: 'white', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '2.75rem', height: '2.75rem', background: s.bg, color: s.color, borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                {s.icon}
              </div>
              <p style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{s.label}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--secondary)' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Events Table */}
        <div style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontWeight: '800', fontSize: '1.1rem' }}>All Events</h2>
            <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: '700' }}>{events.length}</span>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading events...</div>
          ) : events.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Calendar size={40} style={{ marginBottom: '1rem', opacity: 0.3, display: 'block', margin: '0 auto 1rem' }} />
              <p>No events yet. Click "Create Event" to add one!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: '750px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    {['Event', 'Date', 'Price', 'Seats', 'Actions'].map((h, i) => (
                      <th key={h} style={{ padding: '1rem 1.25rem', textAlign: i === 4 ? 'center' : 'left', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', whiteSpace: 'nowrap', borderBottom: '1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event._id} style={{ borderBottom: '1px solid #f3f4f6' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      {/* Event */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={event.image} alt="" style={{ width: '44px', height: '44px', borderRadius: '0.75rem', objectFit: 'cover', flexShrink: 0 }} />
                          <div>
                            <p style={{ fontWeight: '700', fontSize: '0.875rem', whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</p>
                            <span style={{ fontSize: '0.7rem', background: '#f0f4ff', color: 'var(--primary)', borderRadius: '999px', padding: '0.1rem 0.5rem', fontWeight: '600' }}>{event.category}</span>
                          </div>
                        </div>
                      </td>
                      {/* Date */}
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Clock size={14} />
                          {new Date(event.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      {/* Price */}
                      <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '700', color: 'var(--secondary)' }}>
                          <DollarSign size={14} />{event.basePrice}
                        </div>
                      </td>
                      {/* Seats */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ width: '80px', background: '#f0f0f0', borderRadius: '999px', height: '6px', marginBottom: '4px' }}>
                          <div style={{ width: `${Math.min((event.availableSeats / event.capacity) * 100, 100)}%`, background: 'var(--primary)', borderRadius: '999px', height: '100%' }} />
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{event.availableSeats}/{event.capacity}</p>
                      </td>
                      {/* Actions */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => openEditModal(event)}
                            title="Edit event / adjust price / postpone date"
                            style={{ padding: '0.5rem', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '0.625rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                            <Edit2 size={15} /> Edit
                          </button>
                          <button
                            onClick={() => deleteEvent(event._id)}
                            disabled={deleting === event._id}
                            title="Delete event"
                            style={{ padding: '0.5rem', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '0.625rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600', fontSize: '0.8rem', opacity: deleting === event._id ? 0.5 : 1, whiteSpace: 'nowrap' }}>
                            <Trash2 size={15} /> {deleting === event._id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit / Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div
              initial={{ scale: 0.9, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 24 }}
              style={{ background: 'white', width: '100%', maxWidth: '680px', borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>

              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', background: '#fafafa' }}>
                <div>
                  <h2 style={{ fontWeight: '800', fontSize: '1.25rem' }}>{editingEvent ? '✏️ Edit Event' : '➕ Create New Event'}</h2>
                  {editingEvent && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Update details, postpone the date, or adjust the price</p>}
                </div>
                <button onClick={() => setIsModalOpen(false)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '2.25rem', height: '2.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} style={{ padding: '1.5rem 2rem', maxHeight: '72vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

                  {/* Title */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Event Title</label>
                    <input name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Nairobi Jazz Night" style={inputStyle} />
                  </div>

                  {/* Description */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={3} placeholder="Brief event description..." style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>

                  {/* Date — highlighted for postponing */}
                  <div style={{ gridColumn: '1 / -1', background: '#eff6ff', borderRadius: '1rem', padding: '1rem' }}>
                    <label style={{ ...labelStyle, color: '#1d4ed8' }}>📅 Event Date & Time {editingEvent && '(Change to postpone)'}</label>
                    <input type="datetime-local" name="date" value={formData.date} onChange={handleInputChange} required style={{ ...inputStyle, background: 'white' }} />
                  </div>

                  {/* Price — highlighted */}
                  <div style={{ background: '#f0fdf4', borderRadius: '1rem', padding: '1rem' }}>
                    <label style={{ ...labelStyle, color: '#15803d' }}>💰 Base Price (KES)</label>
                    <input type="number" name="basePrice" value={formData.basePrice} onChange={handleInputChange} required min="0" placeholder="e.g. 2500" style={{ ...inputStyle, background: 'white' }} />
                  </div>

                  {/* Category */}
                  <div style={{ background: '#faf5ff', borderRadius: '1rem', padding: '1rem' }}>
                    <label style={{ ...labelStyle, color: '#7e22ce' }}>🏷️ Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} style={{ ...inputStyle, background: 'white' }}>
                      <option>Music</option>
                      <option>Sports</option>
                      <option>Arts</option>
                      <option>Family</option>
                    </select>
                  </div>

                  {/* Venue */}
                  <div>
                    <label style={labelStyle}>Venue</label>
                    <input name="venue" value={formData.venue} onChange={handleInputChange} required placeholder="e.g. KICC Grounds" style={inputStyle} />
                  </div>

                  {/* Location */}
                  <div>
                    <label style={labelStyle}>Location / City</label>
                    <input name="location" value={formData.location} onChange={handleInputChange} required placeholder="e.g. Nairobi, Kenya" style={inputStyle} />
                  </div>

                  {/* Capacity */}
                  <div>
                    <label style={labelStyle}>Total Capacity</label>
                    <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required min="1" placeholder="e.g. 500" style={inputStyle} />
                  </div>

                  {/* Available Seats */}
                  <div>
                    <label style={labelStyle}>Available Seats</label>
                    <input type="number" name="availableSeats" value={formData.availableSeats} onChange={handleInputChange} required min="0" placeholder="e.g. 500" style={inputStyle} />
                  </div>

                  {/* Image URL */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Image URL</label>
                    <div style={{ position: 'relative' }}>
                      <ImageIcon size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input name="image" value={formData.image} onChange={handleInputChange} required placeholder="https://images.unsplash.com/..." style={{ ...inputStyle, paddingLeft: '2.5rem' }} />
                    </div>
                  </div>

                  {/* Featured */}
                  <div style={{ gridColumn: '1 / -1', background: '#fff7ed', borderRadius: '1rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input type="checkbox" name="featured" id="featured" checked={formData.featured} onChange={handleInputChange} style={{ width: '1.1rem', height: '1.1rem', accentColor: 'var(--primary)' }} />
                    <label htmlFor="featured" style={{ fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>⭐ Feature this event on the home page</label>
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" disabled={saving} style={{ flex: 1, padding: '0.875rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.875rem', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                    {saving ? 'Saving...' : (editingEvent ? '✅ Save Changes' : '➕ Create Event')}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.875rem', background: '#f3f4f6', border: 'none', borderRadius: '0.875rem', fontWeight: '700', cursor: 'pointer' }}>
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

const labelStyle = {
  display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem', color: 'var(--secondary)'
};

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem', background: '#f9fafb', border: '1px solid var(--border)',
  borderRadius: '0.75rem', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box'
};

export default AdminDashboard;
