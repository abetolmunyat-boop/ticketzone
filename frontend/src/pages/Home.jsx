import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero';
import EventCard from '../components/EventCard';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Music, Trophy, Theater, Palette, Filter } from 'lucide-react';

const categories = [
  { name: 'All', icon: SlidersHorizontal },
  { name: 'Music', icon: Music },
  { name: 'Sports', icon: Trophy },
  { name: 'Arts', icon: Palette },
  { name: 'Family', icon: Theater }
];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (selectedCategory !== 'All') query.append('category', selectedCategory);
        if (searchTerm) query.append('search', searchTerm);

        const [eventsRes, featuredRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/events?${query.toString()}`),
          axios.get('http://localhost:5000/api/events/featured')
        ]);

        setEvents(eventsRes.data);
        setFeaturedEvents(featuredRes.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Featured Hero */}
      {!searchTerm && <Hero featuredEvents={featuredEvents} />}

      <div className="container px-4 py-12">
        {/* Category Filter & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-black text-secondary mb-2">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'Discover Events'}
            </h2>
            <p className="text-text-muted">Find the best events happening around you</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat.name 
                    ? 'bg-secondary text-white shadow-xl shadow-secondary/20' 
                    : 'bg-white text-text-muted hover:bg-gray-100 border border-border'
                  }`}
                >
                  <Icon size={18} />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-border" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass rounded-3xl">
            <Filter size={48} className="mx-auto text-text-muted mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-secondary mb-2">No events found</h3>
            <p className="text-text-muted">Try adjusting your filters or search terms</p>
            <button 
              onClick={() => { setSelectedCategory('All'); navigate('/'); }}
              className="mt-6 text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
