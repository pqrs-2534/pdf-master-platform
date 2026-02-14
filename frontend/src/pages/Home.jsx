import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  FileOutput,
  Scissors,
  Combine,
  RotateCw,
  Shield,
  Droplet,
  Table,
  Sparkles,
  Edit3,
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Edit3,
      title: 'Edit PDF',
      description: 'Click on text to edit it in place - Real-time preview!',
      path: '/edit',
      gradient: 'from-blue-400 to-indigo-400',
    },
    {
      icon: FileText,
      title: 'Extract Text',
      description: 'Extract all text content from your PDF documents',
      path: '/extract-text',
      gradient: 'from-purple-400 to-pink-400',
    },
    {
      icon: Table,
      title: 'Extract Tables',
      description: 'Pull out tables and structured data from PDFs',
      path: '/extract-tables',
      gradient: 'from-blue-400 to-cyan-400',
    },
    {
      icon: FileOutput,
      title: 'Convert to PDF',
      description: 'Convert DOCX, images, Excel, and more to PDF',
      path: '/convert',
      gradient: 'from-green-400 to-emerald-400',
    },
    {
      icon: Combine,
      title: 'Merge PDFs',
      description: 'Combine multiple PDF files into one document',
      path: '/merge',
      gradient: 'from-orange-400 to-red-400',
    },
    {
      icon: Scissors,
      title: 'Split PDF',
      description: 'Split a PDF into individual pages or sections',
      path: '/split',
      gradient: 'from-yellow-400 to-orange-400',
    },
    {
      icon: RotateCw,
      title: 'Rotate Pages',
      description: 'Rotate PDF pages to any angle you need',
      path: '/rotate',
      gradient: 'from-indigo-400 to-purple-400',
    },
    {
      icon: Droplet,
      title: 'Add Watermark',
      description: 'Protect your PDFs with custom watermarks',
      path: '/watermark',
      gradient: 'from-teal-400 to-blue-400',
    },
    {
      icon: Shield,
      title: 'Encrypt PDF',
      description: 'Secure your documents with password protection',
      path: '/encrypt',
      gradient: 'from-red-400 to-pink-400',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto animate-pulse" />
          </motion.div>

          <h1 className="text-6xl font-bold mb-6 font-display">
            <span className="gradient-text">PDF Master</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Your all-in-one platform for PDF editing, conversion, and manipulation
          </p>
          
          <p className="text-gray-400 max-w-xl mx-auto">
            No restrictions. No limits. Complete control over your PDF documents with real-time preview!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FeatureCard
                {...feature}
                onClick={() => navigate(feature.path)}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-8 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-4xl font-bold gradient-text mb-2">100%</h3>
              <p className="text-gray-400">Free to Use</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold gradient-text mb-2">Real-Time</h3>
              <p className="text-gray-400">Instant Preview</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold gradient-text mb-2">Secure</h3>
              <p className="text-gray-400">Privacy Protected</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;