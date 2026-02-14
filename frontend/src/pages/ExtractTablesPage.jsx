import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Table, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { pdfService } from '../services/api';

const ExtractTablesPage = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [extractedTables, setExtractedTables] = useState(null);

  const acceptedTypes = {
    'application/pdf': ['.pdf'],
  };

  const handleExtract = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select a PDF file first');
      return;
    }

    setLoading(true);
    setExtractedTables(null);

    try {
      const result = await pdfService.extractTables(selectedFiles[0]);
      setExtractedTables(result);
    } catch (error) {
      console.error('Extract error:', error);
      alert('Error extracting tables: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const downloadAsCSV = (table, index) => {
    const csv = table.data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `table_page${table.page}_${index + 1}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
            <Table className="w-12 h-12 text-blue-400" />
            <div>
              <h1 className="text-4xl font-bold gradient-text">Extract Tables</h1>
              <p className="text-gray-400 mt-2">
                Extract structured table data from your PDF documents
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    <Table className="w-5 h-5" />
                    <span>Extract Tables</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            {extractedTables ? (
              <div className="space-y-6">
                <div className="glass-card p-4">
                  <h3 className="text-xl font-semibold">
                    Found {extractedTables.tables_found} table(s)
                  </h3>
                </div>

                <div className="space-y-6 max-h-[600px] overflow-y-auto">
                  {extractedTables.tables.map((table, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-4"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-semibold text-blue-400">
                          Page {table.page} - Table {table.table_number}
                        </span>
                        <button
                          onClick={() => downloadAsCSV(table, index)}
                          className="btn-secondary text-sm px-3 py-1 flex items-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>CSV</span>
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <tbody>
                            {table.data.map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-b border-white/10">
                                {row.map((cell, cellIndex) => (
                                  <td
                                    key={cellIndex}
                                    className="px-3 py-2 text-gray-300 whitespace-nowrap"
                                  >
                                    {cell || '-'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 text-center">
                <Table className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">
                  Upload a PDF to extract tables
                </p>
              </div>
            )}
          </motion.div>
        </div>

        <AnimatePresence>
          {loading && <LoadingSpinner message="Extracting tables..." />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExtractTablesPage;