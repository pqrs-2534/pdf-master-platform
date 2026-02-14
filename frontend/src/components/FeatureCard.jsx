import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, onClick, gradient }) => {
  return (
    <motion.div
      className="feature-card group relative overflow-hidden"
      onClick={onClick}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <motion.div
          className="mb-4"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-12 h-12 text-purple-400" strokeWidth={1.5} />
        </motion.div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-400 text-sm">
          {description}
        </p>
      </div>

      <motion.div
        className="absolute inset-0 border-2 border-transparent rounded-2xl"
        whileHover={{
          borderColor: 'rgba(168, 85, 247, 0.5)',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default FeatureCard;