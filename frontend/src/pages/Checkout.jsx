import React, { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Phone, CheckCircle2, ArrowRight, Lock, ShieldCheck, Ticket } from 'lucide-react';

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { selectedSeats, totalPrice } = location.state || { selectedSeats: [], totalPrice: 0 };
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    try {
      if (paymentMethod === 'mpesa') {
        const res = await axios.post('http://localhost:5000/api/mpesa/stk-push', {
          amount: totalPrice,
          phoneNumber,
          eventId: id,
          seats: selectedSeats.map(s => s.id)
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        // In simulation, we show success after the call
        setIsSuccess(true);
      } else {
        // Stripe simulation
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSuccess(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedSeats.length) {
    return <div className="container py-20 text-center">No seats selected. <button onClick={() => navigate('/')} className="text-primary font-bold">Return Home</button></div>;
  }

  if (isSuccess) {
    return (
      <div className="container py-24 flex flex-col items-center text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-100 text-green-600 p-6 rounded-full mb-8"
        >
          <CheckCircle2 size={64} />
        </motion.div>
        <h2 className="text-4xl font-black text-secondary mb-4">Payment Successful!</h2>
        <p className="text-text-muted text-lg mb-12 max-w-md">
          Your tickets are confirmed and available in your profile. A confirmation email has been sent.
        </p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/profile')} className="btn btn-primary px-8 py-4 rounded-2xl font-bold">View My Tickets</button>
          <button onClick={() => navigate('/')} className="px-8 py-4 rounded-2xl font-bold text-secondary hover:bg-gray-100 transition-all">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-12">
      <div className="container max-w-5xl px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <h1 className="text-3xl font-black text-secondary">Checkout</h1>
          <div className="flex-1 h-[2px] bg-gray-200 relative">
            <div className={`absolute top-0 left-0 h-full bg-primary transition-all duration-500 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
          </div>
          <div className="flex items-center gap-2 text-sm font-bold">
            <span className={step >= 1 ? 'text-primary' : 'text-gray-300'}>1. Details</span>
            <span className="text-gray-300">/</span>
            <span className={step === 2 ? 'text-primary' : 'text-gray-300'}>2. Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Flow */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 rounded-3xl border border-border shadow-sm"
                >
                  <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <CheckCircle2 className="text-green-500" size={24} /> Review Order
                  </h2>
                  <div className="space-y-6">
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <Ticket className="w-full h-full p-4 bg-primary/10 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">Standard Tickets</h3>
                        <p className="text-text-muted text-sm">{selectedSeats.length} Seats: {selectedSeats.map(s => s.id.split('-').slice(1).join('')).join(', ')}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-wider text-text-muted">Delivery Details</h4>
                      <p className="font-medium">{user?.name || 'Guest User'}</p>
                      <p className="text-text-muted text-sm">{user?.email || 'Login required for delivery'}</p>
                    </div>

                    <button 
                      onClick={() => setStep(2)}
                      className="btn btn-primary w-full py-4 mt-8 rounded-2xl font-bold text-lg"
                    >
                      Continue to Payment <ArrowRight size={20} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-8 rounded-3xl border border-border shadow-sm"
                >
                  <h2 className="text-xl font-bold mb-8">Select Payment Method</h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col gap-3 ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:bg-gray-50'}`}
                    >
                      <CreditCard className={paymentMethod === 'card' ? 'text-primary' : 'text-text-muted'} size={28} />
                      <div className="text-left">
                        <p className="font-bold">Credit/Debit Card</p>
                        <p className="text-xs text-text-muted">Visa, Mastercard, Amex</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => setPaymentMethod('mpesa')}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col gap-3 ${paymentMethod === 'mpesa' ? 'border-primary bg-primary/5' : 'border-border hover:bg-gray-50'}`}
                    >
                      <Phone className={paymentMethod === 'mpesa' ? 'text-primary' : 'text-text-muted'} size={28} />
                      <div className="text-left">
                        <p className="font-bold">M-Pesa</p>
                        <p className="text-xs text-text-muted">Mobile Money (STK Push)</p>
                      </div>
                    </button>
                  </div>

                  {paymentMethod === 'mpesa' ? (
                    <div className="p-6 bg-gray-50 rounded-2xl mb-8">
                      <label className="text-sm font-bold mb-2 block">Phone Number (Safaricom)</label>
                      <input 
                        type="tel"
                        className="w-full p-4 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="2547XXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <p className="text-xs text-text-muted mt-3">An M-Pesa prompt will be sent to this number.</p>
                    </div>
                  ) : (
                    <div className="p-6 bg-gray-50 rounded-2xl mb-8 space-y-4">
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                        <input className="w-full pl-12 pr-4 py-4 rounded-xl border border-border outline-none" placeholder="Card Number" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input className="w-full p-4 rounded-xl border border-border outline-none" placeholder="MM/YY" />
                        <input className="w-full p-4 rounded-xl border border-border outline-none" placeholder="CVC" />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="btn btn-primary w-full py-4 rounded-2xl font-bold text-lg"
                    >
                      {isProcessing ? 'Processing...' : `Pay $${totalPrice}`}
                    </button>
                    <button 
                      onClick={() => setStep(1)}
                      className="text-text-muted font-bold text-sm hover:text-secondary"
                    >
                      Go back to review
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-center gap-8 py-4 opacity-50 grayscale">
              <ShieldCheck size={20} /> <Lock size={20} /> <span>SSL Secure Payment</span>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl border border-border sticky top-28">
              <h3 className="font-bold text-lg mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">{selectedSeats.length} Tickets</span>
                  <span className="font-bold">${totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Booking Fee</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-between items-center mb-6">
                <span className="font-bold">Total Amount</span>
                <span className="text-2xl font-black text-secondary">${totalPrice}</span>
              </div>
              <div className="bg-primary/5 p-4 rounded-2xl flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg text-primary shadow-sm">
                  <ShieldCheck size={18} />
                </div>
                <p className="text-[10px] text-text-muted uppercase font-black tracking-wider leading-relaxed">
                  100% Buyer Guarantee<br />
                  <span className="text-[9px] font-normal lowercase tracking-normal">Full refund if the event is cancelled</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
