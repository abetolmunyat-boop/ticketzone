import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const EventCard = ({ event }) => {
  const date = new Date(event.date);
  
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all duration-500"
    >
      <Link to={`/event/${event._id}`}>
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-secondary text-xs font-bold rounded-full shadow-sm">
              {event.category}
            </span>
          </div>

          {/* Date Badge Overlay */}
          <div className="absolute top-4 right-4 bg-primary text-white p-2 px-3 rounded-2xl flex flex-col items-center shadow-lg">
            <span className="text-xs font-bold uppercase">{date.toLocaleString('default', { month: 'short' })}</span>
            <span className="text-xl font-black">{date.getDate()}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
            <Calendar size={14} />
            <span>{date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</span>
          </div>
          
          <h3 className="text-xl font-bold text-secondary mb-3 line-clamp-1 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          <div className="flex items-center gap-1.5 text-text-muted text-sm mb-6">
            <MapPin size={14} />
            <span className="line-clamp-1">{event.venue}, {event.location}</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-text-muted font-medium mb-0.5">Tickets from</p>
              <p className="text-xl font-black text-secondary">${event.basePrice}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
