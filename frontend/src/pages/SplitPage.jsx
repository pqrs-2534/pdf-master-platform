import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Scissors, Download, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { pdfService, downloadBlob } from '../services/api';

const SplitPage = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [splitResult, setSplitResult] = useState(null);

  const acceptedTypes = {
    'application/pdf': ['.pdf'],
  };

  const handleSplit = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select a PDF file first');
      return;
    }

    setLoading(true);
    setSplitResult(null);

    try {
      const result = await pdfService.splitPDF(selectedFiles[0]);
      setSplitResult(result);
    } catch (error) {
      console.error('Split error:', error);
      alert('Error splitting PDF: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const downloadPage = async (filename) => {
    try {
      const blob = await pdfService.downloadFile(filename);
      downloadBlob(blob, filename);
    } catch (error) {
      alert('Error downloading file: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
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
            <Scissors className="w-12 h-12 text-yellow-400" />
            <div>
              <h1 className="text-4xl font-bold gradient-text">Split PDF</h1>
              <p className="text-gray-400 mt-2">
                Split a PDF into individual pages
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FileUpload
              onFilesSelected={setSelectedFiles}
              acceptedFileTypes={acceptedTypes}
              multiple={false}
              maxFiles={1}
            />

            <AnimatePresence>
              {selectedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-6 flex justify-center"
                >
                  <button
                    onClick={handleSplit}
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Scissors className="w-5 h-5" />
                    <span>Split PDF</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {splitResult ? (
              <div className="glass-card p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-semibold">
                    Split into {splitResult.total_pages} pages
                  </h3>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {splitResult.files.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/5 p-4 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">Page {file.page}</p>
                        <p className="text-sm text-gray-400">{file.filename}</p>
                      </div>
                      <button
                        onClick={() => downloadPage(file.filename)}
                        className="btn-secondary text-sm px-3 py-2 flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <Scissors className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">
                  Upload a PDF to split it into pages
                </p>
              </div>
            )}
          </motion.div>
        </div>

        <AnimatePresence>
          {loading && <LoadingSpinner message="Splitting PDF..." />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SplitPage;