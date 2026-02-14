import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = 'Processing...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-8 flex flex-col items-center space-y-4"
      >
        <div className="relative">
          <motion.div
            className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-0 w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <p className="text-lg font-medium">{message}</p>
      </motion.div>
    </motion.div>
  );
};

export default LoadingSpinner;