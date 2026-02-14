// FILE 16 - Merge Page
// Location: pdf-platform/frontend/src/pages/MergePage.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Combine, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { pdfService, downloadBlob } from '../services/api';

const MergePage = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const acceptedTypes = {
    'application/pdf': ['.pdf'],
  };

  const handleMerge = async () => {
    if (selectedFiles.length < 2) {
      alert('Please select at least 2 PDF files to merge');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const blob = await pdfService.mergePDFs(selectedFiles);
      downloadBlob(blob, `merged_${Date.now()}.pdf`);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Merge error:', error);
      alert('Error merging PDFs: ' + (error.response?.data?.detail || error.message));
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
            <Combine className="w-12 h-12 text-orange-400" />
            <div>
              <h1 className="text-4xl font-bold gradient-text">Merge PDFs</h1>
              <p className="text-gray-400 mt-2">
                Combine multiple PDF files into a single document
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
            maxFiles={20}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="text-lg font-semibold mb-3">How it works</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start space-x-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Upload 2 or more PDF files</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Files will be merged in the order you upload them</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>Download your combined PDF instantly</span>
            </li>
          </ul>
        </motion.div>

        <AnimatePresence>
          {selectedFiles.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex justify-center"
            >
              <button
                onClick={handleMerge}
                disabled={loading}
                className="btn-primary flex items-center space-x-2 text-lg"
              >
                {success ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>Merged Successfully!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    <span>Merge {selectedFiles.length} PDFs</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loading && <LoadingSpinner message="Merging PDFs..." />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MergePage;