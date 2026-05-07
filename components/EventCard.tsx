"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";

interface EventProps {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
}

const EventCard = ({ title, description, date, time, location }: EventProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass p-6 rounded-2xl group transition-all duration-300 hover:border-neon/50"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="bg-neon/10 p-3 rounded-xl border border-neon/20 text-neon">
          <Calendar size={24} />
        </div>
        <div className="text-right">
          <p className="text-neon font-bold text-lg">{date}</p>
          <p className="text-gray-500 text-xs uppercase tracking-widest">{time}</p>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-neon transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 text-sm mb-6 line-clamp-3">
        {description}
      </p>
      
      <div className="flex items-center gap-2 text-gray-500 text-xs">
        <MapPin size={14} className="text-neon" />
        <span>{location}</span>
      </div>
    </motion.div>
  );
};

export default EventCard;
