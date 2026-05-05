import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = ({ featuredEvents }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredEvents.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredEvents]);

  if (!featuredEvents || featuredEvents.length === 0) return null;

  const currentEvent = featuredEvents[currentIndex];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? featuredEvents.length - 1 : prev - 1));

  return (
    <section className="relative h-[600px] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentEvent._id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img 
            src={currentEvent.image} 
            alt={currentEvent.title}
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="container relative h-full flex flex-col justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentEvent._id + "-content"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-widest mb-6">
              Featured Event
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              {currentEvent.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 mb-8 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-primary" />
                <span className="font-medium">
                  {new Date(currentEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                <span className="font-medium">{currentEvent.venue}, {currentEvent.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                to={`/event/${currentEvent._id}`} 
                className="btn btn-primary px-8 py-4 rounded-full text-lg font-bold shadow-xl shadow-primary/30"
              >
                Get Tickets
              </Link>
              <span className="text-white font-medium">Starting from ${currentEvent.basePrice}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-10 right-4 container flex justify-end gap-3 px-4">
        <button 
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/20"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/20"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-10 left-4 container px-4 flex gap-2">
        {featuredEvents.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 transition-all duration-500 rounded-full ${index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-white/30'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
