import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = ({ onFilesSelected, acceptedFileTypes, multiple = false, maxFiles = 1 }) => {
  const [files, setFiles] = React.useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple,
    maxFiles,
  });

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <motion.div
        {...getRootProps()}
        className={`glass-card border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-purple-400 bg-purple-500/20 scale-105'
            : 'border-white/20 hover:border-purple-400/50 hover:bg-white/10'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Upload className="w-16 h-16 mx-auto mb-4 text-purple-400" />
        </motion.div>
        
        {isDragActive ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xl font-semibold text-purple-300">Drop your files here...</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xl font-semibold mb-2">Drag & drop your files here</p>
            <p className="text-gray-400 mb-4">or click to browse</p>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-3"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4 flex items-center justify-between group hover:bg-white/10"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <FileText className="w-8 h-8 text-purple-400" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;