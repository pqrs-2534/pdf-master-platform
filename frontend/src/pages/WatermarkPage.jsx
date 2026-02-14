import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Droplet, Download, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { pdfService, downloadBlob } from '../services/api';

const WatermarkPage = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');

  const acceptedTypes = {
    'application/pdf': ['.pdf'],
  };

  const handleAddWatermark = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select a PDF file first');
      return;
    }

    if (!watermarkText.trim()) {
      alert('Please enter watermark text');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const blob = await pdfService.addWatermark(selectedFiles[0], watermarkText);
      downloadBlob(blob, `watermarked_${selectedFiles[0].name}`);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Watermark error:', error);
      alert('Error adding watermark: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const presetWatermarks = [
    'CONFIDENTIAL',
    'DRAFT',
    'COPY',
    'SAMPLE',
    'DO NOT COPY',
    'FOR REVIEW',
  ];

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
            <Droplet className="w-12 h-12 text-teal-400" />
            <div>
              <h1 className="text-4xl font-bold gradient-text">Add Watermark</h1>
              <p className="text-gray-400 mt-2">
                Protect your PDFs with custom text watermarks
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
            multiple={false}
            maxFiles={1}
          />
        </motion.div>

        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 mb-8"
            >
              <h3 className="text-lg font-semibold mb-4">Watermark Text</h3>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Enter watermark text"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-lg"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Maximum 50 characters. The watermark will appear diagonally across each page.
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Quick Presets</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {presetWatermarks.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setWatermarkText(preset)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-all"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-2">Preview:</p>
                  <div className="bg-gray-800 rounded-lg h-32 flex items-center justify-center relative overflow-hidden">
                    <div 
                      className="text-gray-500 text-2xl font-bold opacity-30"
                      style={{ transform: 'rotate(-45deg)' }}
                    >
                      {watermarkText || 'Your Watermark'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedFiles.length > 0 && watermarkText.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <button
                onClick={handleAddWatermark}
                disabled={loading}
                className="btn-primary flex items-center space-x-2 text-lg"
              >
                {success ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>Watermark Added!</span>
                  </>
                ) : (
                  <>
                    <Droplet className="w-6 h-6" />
                    <span>Add Watermark</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loading && <LoadingSpinner message="Adding watermark..." />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WatermarkPage;