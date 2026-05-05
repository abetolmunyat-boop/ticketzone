import React from 'react';
import { motion } from 'framer-motion';

const SeatingChart = ({ selectedSeats, onSeatSelect }) => {
  // Simulate sections
  const sections = [
    { id: 'Front Row', rows: 4, seatsPerRow: 10, price: 350, color: 'bg-amber-400' },
    { id: 'Middle Section', rows: 6, seatsPerRow: 12, price: 199, color: 'bg-primary' },
    { id: 'Back Section', rows: 8, seatsPerRow: 15, price: 99, color: 'bg-blue-400' }
  ];

  const handleSeatClick = (sectionId, row, col, price) => {
    const seatId = `${sectionId}-${row}-${col}`;
    onSeatSelect(seatId, price);
  };

  return (
    <div className="bg-gray-900 p-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-800">
      {/* Stage */}
      <div className="w-3/4 h-8 bg-gradient-to-b from-gray-700 to-gray-800 mx-auto mb-16 rounded-b-xl flex items-center justify-center">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.5em]">Stage</span>
      </div>

      <div className="flex flex-col items-center gap-12">
        {sections.map((section) => (
          <div key={section.id} className="w-full">
            <div className="flex justify-between items-end mb-4 px-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">{section.id}</h4>
              <span className="text-primary font-bold text-xs">${section.price} per seat</span>
            </div>
            
            <div className="flex flex-col gap-2 items-center">
              {Array.from({ length: section.rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-2">
                  <span className="w-4 text-[10px] text-gray-600 flex items-center">{String.fromCharCode(65 + rowIndex)}</span>
                  {Array.from({ length: section.seatsPerRow }).map((_, colIndex) => {
                    const seatId = `${section.id}-${rowIndex}-${colIndex}`;
                    const isSelected = selectedSeats.some(s => s.id === seatId);
                    
                    return (
                      <motion.button
                        key={colIndex}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSeatClick(section.id, rowIndex, colIndex, section.price)}
                        className={`w-6 h-6 rounded-md transition-all duration-300 flex items-center justify-center text-[8px] font-bold ${
                          isSelected 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/50 scale-110' 
                          : `${section.color} text-white/40 hover:text-white`
                        }`}
                        title={`Seat ${String.fromCharCode(65 + rowIndex)}${colIndex + 1} - $${section.price}`}
                      >
                        {colIndex + 1}
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-12 flex justify-center gap-6 pt-8 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-700" />
          <span className="text-xs text-gray-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-xs text-gray-400">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500 opacity-50" />
          <span className="text-xs text-gray-400">Sold Out</span>
        </div>
      </div>
    </div>
  );
};

export default SeatingChart;
