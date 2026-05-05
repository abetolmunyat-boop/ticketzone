import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Ticket, History, LogOut, ChevronRight, QrCode, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tickets');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/payments/user-orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (authLoading) return <div className="container py-20 text-center">Loading...</div>;
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-12">
      <div className="container px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-border shadow-sm flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                <User size={48} />
              </div>
              <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
              <p className="text-text-muted text-sm mb-6">{user.email}</p>
              <div className="inline-block px-4 py-1.5 bg-gray-100 rounded-full text-xs font-bold uppercase tracking-wider text-text-muted">
                {user.role} Account
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
              <button 
                onClick={() => setActiveTab('tickets')}
                className={`w-full p-5 flex items-center justify-between transition-all ${activeTab === 'tickets' ? 'bg-primary/5 text-primary border-l-4 border-primary' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <Ticket size={20} /> <span className="font-bold">My Tickets</span>
                </div>
                <ChevronRight size={18} />
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`w-full p-5 flex items-center justify-between transition-all ${activeTab === 'history' ? 'bg-primary/5 text-primary border-l-4 border-primary' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <History size={20} /> <span className="font-bold">Order History</span>
                </div>
                <ChevronRight size={18} />
              </button>
              <button 
                onClick={handleLogout}
                className="w-full p-5 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut size={20} /> <span className="font-bold">Logout</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-2/3">
            <AnimatePresence mode="wait">
              {activeTab === 'tickets' ? (
                <motion.div 
                  key="tickets"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-2xl font-black mb-8">Active Tickets</h3>
                  
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2].map(i => <div key={i} className="h-40 bg-white rounded-3xl animate-pulse" />)}
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col md:flex-row">
                          <div className="w-full md:w-48 h-48 bg-gray-100 relative shrink-0">
                            <img src={order.event.image} alt={order.event.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20" />
                          </div>
                          <div className="p-6 flex-1">
                            <h4 className="text-xl font-bold mb-2">{order.event.title}</h4>
                            <div className="flex flex-col gap-2 mb-6">
                              <div className="flex items-center gap-2 text-text-muted text-sm">
                                <Calendar size={14} /> <span>{new Date(order.event.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-text-muted text-sm">
                                <MapPin size={14} /> <span>{order.event.venue}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {order.seats.map(seat => (
                                <button 
                                  key={seat}
                                  onClick={() => setSelectedTicket({ order, seat })}
                                  className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                                >
                                  <QrCode size={14} /> Seat {seat}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white py-20 rounded-3xl border-2 border-dashed border-gray-200 text-center">
                      <Ticket size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-text-muted font-medium">You haven't purchased any tickets yet.</p>
                      <button onClick={() => navigate('/')} className="mt-4 text-primary font-bold">Browse Events</button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-2xl font-black mb-8">Order History</h3>
                  <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-border">
                        <tr>
                          <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-text-muted">Event</th>
                          <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-text-muted">Date</th>
                          <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-text-muted">Amount</th>
                          <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-text-muted">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="p-6 font-bold text-sm">{order.event.title}</td>
                            <td className="p-6 text-sm text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="p-6 font-bold text-sm">${order.totalAmount}</td>
                            <td className="p-6">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-primary p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-1">Official Ticket</h3>
                <p className="text-white/80 text-sm">{selectedTicket.order.event.title}</p>
              </div>
              
              <div className="p-8 flex flex-col items-center">
                <div className="bg-white p-4 border-2 border-gray-100 rounded-3xl mb-8">
                  <QRCode value={`TICKET-${selectedTicket.order._id}-${selectedTicket.seat}`} size={180} />
                </div>
                
                <div className="w-full space-y-4 mb-8">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-xs text-text-muted font-bold uppercase tracking-widest">Section / Seat</span>
                    <span className="font-bold">General / {selectedTicket.seat}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-xs text-text-muted font-bold uppercase tracking-widest">Order ID</span>
                    <span className="text-sm font-mono">{selectedTicket.order._id.slice(-8)}</span>
                  </div>
                </div>

                <p className="text-[10px] text-text-muted text-center uppercase tracking-widest leading-relaxed">
                  Present this QR code at the venue entrance.<br />
                  Verified by TicketsZone Guarantee.
                </p>
              </div>
              
              <button 
                onClick={() => setSelectedTicket(null)}
                className="w-full py-5 bg-gray-50 text-secondary font-bold text-sm border-t border-gray-100 hover:bg-gray-100 transition-all"
              >
                Close Ticket
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
