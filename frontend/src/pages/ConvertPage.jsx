// FILE 15 - Convert Page
// Location: pdf-platform/frontend/src/pages/ConvertPage.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, FileOutput, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { pdfService, downloadBlob } from '../services/api';

const ConvertPage = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const acceptedTypes = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/plain': ['.txt'],
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select a file first');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      for (const file of selectedFiles) {
        const blob = await pdfService.convertToPDF(file);
        const filename = file.name.replace(/\.[^/.]+$/, '') + '.pdf';
        downloadBlob(blob, filename);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Error converting file: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center space-x-4 mb-4">
            <FileOutput className="w-12 h-12 text-green-400" />
            <div>
              <h1 className="text-4xl font-bold gradient-text">Convert to PDF</h1>
              <p className="text-gray-400 mt-2">
                Convert images, documents, and spreadsheets to PDF format
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <FileUpload
            onFilesSelected={setSelectedFiles}
            acceptedFileTypes={acceptedTypes}
            multiple={true}
            maxFiles={10}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="text-lg font-semibold mb-3">Supported Formats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-purple-400 font-semibold">Images</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, BMP</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-blue-400 font-semibold">Documents</p>
              <p className="text-xs text-gray-400 mt-1">DOCX, TXT</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-green-400 font-semibold">Spreadsheets</p>
              <p className="text-xs text-gray-400 mt-1">XLSX</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-orange-400 font-semibold">More</p>
              <p className="text-xs text-gray-400 mt-1">Coming soon</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex justify-center"
            >
              <button
                onClick={handleConvert}
                disabled={loading}
                className="btn-primary flex items-center space-x-2 text-lg"
              >
                {success ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>Converted Successfully!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    <span>Convert to PDF</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loading && <LoadingSpinner message="Converting to PDF..." />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ConvertPage;