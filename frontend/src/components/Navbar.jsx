import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Ticket, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container px-4 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
            <Ticket className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight text-secondary">
            Tickets<span className="text-primary">Zone</span>
          </span>
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search by artist, event or venue"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {user.role === 'admin' && (
                <Link to="/admin" className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 font-medium text-sm transition-colors">
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 font-medium text-sm transition-colors">
                <User size={18} />
                <span className="hidden sm:inline">My Account</span>
              </Link>
              <button 
                onClick={logout}
                className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary/20">
                Register
              </Link>
            </div>
          )}
          
          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search - Visible only on mobile */}
      <div className="md:hidden px-4 pb-4">
        <form onSubmit={handleSearch} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text"
            placeholder="Search events"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              <Link to="/" className="p-3 hover:bg-gray-50 rounded-xl flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="p-3 hover:bg-gray-50 rounded-xl flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                  <LayoutDashboard size={20} /> Admin Dashboard
                </Link>
              )}
              <Link to="/profile" className="p-3 hover:bg-gray-50 rounded-xl flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                <User size={20} /> My Account
              </Link>
              {user && (
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="p-3 text-left text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-3">
                  <LogOut size={20} /> Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
