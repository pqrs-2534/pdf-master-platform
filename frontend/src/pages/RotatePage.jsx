import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCw, Download, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { pdfService, downloadBlob } from '../services/api';

const RotatePage = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [angle, setAngle] = useState(90);
  const [pages, setPages] = useState('all');

  const acceptedTypes = {
    'application/pdf': ['.pdf'],
  };

  const handleRotate = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select a PDF file first');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const blob = await pdfService.rotatePDF(selectedFiles[0], angle, pages);
      downloadBlob(blob, `rotated_${selectedFiles[0].name}`);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Rotate error:', error);
      alert('Error rotating PDF: ' + (error.response?.data?.detail || error.message));
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
            <RotateCw className="w-12 h-12 text-indigo-400" />
            <div>
              <h1 className="text-4xl font-bold gradient-text">Rotate PDF Pages</h1>
              <p className="text-gray-400 mt-2">
                Rotate PDF pages by 90, 180, or 270 degrees
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
              <h3 className="text-lg font-semibold mb-4">Rotation Options</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Rotation Angle</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[90, 180, 270, -90].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => setAngle(deg)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          angle === deg
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/10 hover:border-purple-500/50'
                        }`}
                      >
                        <RotateCw 
                          className={`w-8 h-8 mx-auto mb-2 text-purple-400`}
                          style={{ transform: `rotate(${deg}deg)` }}
                        />
                        <p className="text-sm font-medium">{deg}°</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Pages to Rotate</label>
                  <input
                    type="text"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="all or 1,3,5"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Enter "all" for all pages, or comma-separated page numbers (e.g., "1,3,5")
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <button
                onClick={handleRotate}
                disabled={loading}
                className="btn-primary flex items-center space-x-2 text-lg"
              >
                {success ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>Rotated Successfully!</span>
                  </>
                ) : (
                  <>
                    <RotateCw className="w-6 h-6" />
                    <span>Rotate PDF</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loading && <LoadingSpinner message="Rotating PDF..." />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RotatePage;