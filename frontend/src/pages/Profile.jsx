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

  const downloadTicketPDF = () => {
    if (!selectedTicket) return;
    const { order, seat } = selectedTicket;
    const event = order.event;
    const qrValue = `TICKET-${order._id}-${seat}`;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>TicketsZone - ${event.title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; background: white; display: flex; justify-content: center; padding: 40px; }
          .ticket { width: 420px; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border: 1px solid #e5e7eb; }
          .header { background: #026cdf; padding: 28px; text-align: center; color: white; }
          .header h1 { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 4px; }
          .header p { font-size: 13px; opacity: 0.85; }
          .logo { font-size: 11px; opacity: 0.7; margin-top: 8px; letter-spacing: 1px; text-transform: uppercase; }
          .body { padding: 32px; display: flex; flex-direction: column; align-items: center; }
          .qr-wrap { background: white; padding: 16px; border: 2px solid #f0f0f0; border-radius: 16px; margin-bottom: 24px; }
          .details { width: 100%; margin-bottom: 24px; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
          .label { color: #9ca3af; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.08em; }
          .value { font-weight: 700; color: #111; }
          .footer { font-size: 10px; color: #9ca3af; text-align: center; text-transform: uppercase; letter-spacing: 0.08em; line-height: 1.8; }
          .perforated { border-top: 2px dashed #e5e7eb; margin: 16px 0; }
          @media print { body { padding: 0; } .ticket { box-shadow: none; } }
        </style>
        <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <div class="logo">🎫 TicketsZone</div>
            <h1>${event.title}</h1>
            <p>${new Date(event.date).toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div class="body">
            <div class="qr-wrap">
              <canvas id="qrCanvas"></canvas>
            </div>
            <div class="details">
              <div class="row"><span class="label">Event</span><span class="value">${event.title}</span></div>
              <div class="row"><span class="label">Venue</span><span class="value">${event.venue || event.location}</span></div>
              <div class="row"><span class="label">Date</span><span class="value">${new Date(event.date).toLocaleDateString()}</span></div>
              <div class="row"><span class="label">Seat</span><span class="value">${seat}</span></div>
              <div class="row"><span class="label">Order ID</span><span class="value">${order._id.slice(-8).toUpperCase()}</span></div>
            </div>
            <div class="perforated"></div>
            <div class="footer">Present this QR code at the venue entrance<br />Verified by TicketsZone Guarantee &bull; ticketzone-cyan.vercel.app</div>
          </div>
        </div>
        <script>
          QRCode.toCanvas(document.getElementById('qrCanvas'), '${qrValue}', { width: 200 }, function() {
            setTimeout(() => window.print(), 500);
          });
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  useEffect(() => {
    if (!user) return;
    
    const fetchOrders = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${API_URL}/api/payments/user-orders`, {
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
              
              <div style={{ display: 'flex', borderTop: '1px solid #f3f4f6' }}>
                <button
                  onClick={downloadTicketPDF}
                  style={{ flex: 1, padding: '1.25rem', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  📥 Download PDF
                </button>
                <button
                  onClick={() => setSelectedTicket(null)}
                  style={{ flex: 1, padding: '1.25rem', background: '#f9fafb', border: 'none', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
