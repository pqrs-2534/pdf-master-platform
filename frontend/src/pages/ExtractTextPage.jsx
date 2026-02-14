// FILE 17 - Extract Text Page
// Location: pdf-platform/frontend/src/pages/ExtractTextPage.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText, Copy, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { pdfService } from '../services/api';

const ExtractTextPage = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState(null);
  const [copied, setCopied] = useState(false);

  const acceptedTypes = {
    'application/pdf': ['.pdf'],
  };

  const handleExtract = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select a PDF file first');
      return;
    }

    setLoading(true);
    setExtractedText(null);

    try {
      const result = await pdfService.extractText(selectedFiles[0]);
      setExtractedText(result);
    } catch (error) {
      console.error('Extract error:', error);
      alert('Error extracting text: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const allText = extractedText.content.map(page => page.text).join('\n\n');
    navigator.clipboard.writeText(allText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <FileText className="w-12 h-12 text-purple-400" />
            <div>
              <h1 className="text-4xl font-bold gradient-text">Extract Text</h1>
              <p className="text-gray-400 mt-2">
                Extract all text content from your PDF documents
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
                    onClick={handleExtract}
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Extract Text</span>
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
            {extractedText ? (
              <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">
                    Extracted Text ({extractedText.pages} pages)
                  </h3>
                  <button
                    onClick={copyToClipboard}
                    className="btn-secondary flex items-center space-x-2 text-sm"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy All</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {extractedText.content.map((page, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-purple-400">
                          Page {page.page}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">
                        {page.text || 'No text found on this page'}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">
                  Upload a PDF to extract its text content
                </p>
              </div>
            )}
          </motion.div>
        </div>

        <AnimatePresence>
          {loading && <LoadingSpinner message="Extracting text..." />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExtractTextPage;