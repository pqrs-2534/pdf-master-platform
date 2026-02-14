import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Download, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { pdfService, downloadBlob } from '../services/api';

const EncryptPage = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const acceptedTypes = {
    'application/pdf': ['.pdf'],
  };

  const handleEncrypt = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select a PDF file first');
      return;
    }

    if (!password) {
      alert('Please enter a password');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (password.length < 4) {
      alert('Password must be at least 4 characters long');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const blob = await pdfService.encryptPDF(selectedFiles[0], password);
      downloadBlob(blob, `encrypted_${selectedFiles[0].name}`);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPassword('');
        setConfirmPassword('');
      }, 3000);
    } catch (error) {
      console.error('Encrypt error:', error);
      alert('Error encrypting PDF: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, label: 'None', color: 'gray' };
    if (pass.length < 6) return { strength: 1, label: 'Weak', color: 'red' };
    if (pass.length < 10) return { strength: 2, label: 'Medium', color: 'yellow' };
    return { strength: 3, label: 'Strong', color: 'green' };
  };

  const passwordStrength = getPasswordStrength(password);

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
            <Shield className="w-12 h-12 text-red-400" />
            <div>
              <h1 className="text-4xl font-bold gradient-text">Encrypt PDF</h1>
              <p className="text-gray-400 mt-2">
                Secure your documents with password protection
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
              <h3 className="text-lg font-semibold mb-4">Set Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              passwordStrength.color === 'red' ? 'bg-red-500' :
                              passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength.color === 'red' ? 'text-red-400' :
                          passwordStrength.color === 'yellow' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Use at least 10 characters for better security
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-400 mt-2">Passwords do not match</p>
                  )}
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-sm text-yellow-400 flex items-start space-x-2">
                    <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Important:</strong> Make sure to remember this password! 
                      You'll need it to open the encrypted PDF. There is no way to recover a lost password.
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedFiles.length > 0 && password && confirmPassword && password === confirmPassword && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <button
                onClick={handleEncrypt}
                disabled={loading}
                className="btn-primary flex items-center space-x-2 text-lg"
              >
                {success ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>PDF Encrypted!</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-6 h-6" />
                    <span>Encrypt PDF</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loading && <LoadingSpinner message="Encrypting PDF..." />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EncryptPage;