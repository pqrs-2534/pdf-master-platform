import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Download, Save, Trash2, ZoomIn, ZoomOut, Type, MousePointer,
  Image as ImageIcon, Square, Circle, Minus, Highlighter, Bold, Italic, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { pdfService, downloadBlob } from '../services/api';

const AdvancedEditPdfPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [edits, setEdits] = useState([]);
  const [images, setImages] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [selectedTextBlock, setSelectedTextBlock] = useState(null);
  const [mode, setMode] = useState('select');
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [showTextOptions, setShowTextOptions] = useState(false);
  
  // Text formatting
  const [fontSize, setFontSize] = useState(12);
  const [fontColor, setFontColor] = useState('#000000');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  
  // Shape options
  const [shapeType, setShapeType] = useState('rectangle');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('');
  const [strokeWidth, setStrokeWidth] = useState(2);
  
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const imageUploadRef = useRef(null);

  const acceptedTypes = {
    'application/pdf': ['.pdf'],
  };

  // Draw text blocks AND real-time preview of edits
  useEffect(() => {
    if (pdfPages.length > 0 && canvasRef.current && imageRef.current) {
      drawTextBlocks();
      drawRealTimeEdits();
    }
  }, [currentPage, pdfPages, zoom, hoveredBlock, selectedTextBlock, edits]);

  const handleFileSelect = async (files) => {
    if (files.length === 0) return;
    
    const file = files[0];
    setSelectedFile(file);
    setLoading(true);
    
    try {
      const result = await pdfService.getPdfPagesWithTextLocations(file);
      setPdfPages(result.pages);
      setCurrentPage(0);
      setEdits([]);
      setSelectedTextBlock(null);
    } catch (error) {
      console.error('Error loading PDF:', error);
      alert('Error loading PDF: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const drawTextBlocks = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    canvas.width = img.width * zoom;
    canvas.height = img.height * zoom;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const currentPageData = pdfPages[currentPage];
    if (!currentPageData) return;
    
    // Draw rectangles around text blocks
    currentPageData.textBlocks.forEach((block, index) => {
      const x = block.x * zoom;
      const y = block.y * zoom;
      const width = block.width * zoom;
      const height = block.height * zoom;
      
      if (selectedTextBlock === index) {
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
      } else if (hoveredBlock === index) {
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.lineWidth = 1;
      }
      
      ctx.strokeRect(x, y, width, height);
      
      if (selectedTextBlock === index) {
        ctx.fillStyle = 'rgba(168, 85, 247, 0.1)';
        ctx.fillRect(x, y, width, height);
      }
    });
  };

  // REAL-TIME PREVIEW OF EDITS
  const drawRealTimeEdits = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Get edits for current page
    const pageEdits = edits.filter(edit => edit.page === currentPage + 1);
    
    pageEdits.forEach(edit => {
      const editType = edit.type;
      
      // DRAW TEXT EDITS
      if (editType === 'text') {
        const action = edit.action;
        
        // Show removal area
        if (action === 'replace' || action === 'delete') {
          const removeArea = edit.removeArea;
          if (removeArea) {
            const x = removeArea.x * zoom;
            const y = removeArea.y * zoom;
            const width = removeArea.width * zoom;
            const height = removeArea.height * zoom;
            
            // Draw white rectangle to show what will be removed
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(x, y, width, height);
          }
        }
        
        // Show new text
        if (action === 'replace' || action === 'add') {
          const text = edit.text;
          const x = edit.x * zoom;
          const y = edit.y * zoom;
          const fontSize = edit.fontSize * zoom;
          const bold = edit.bold;
          const italic = edit.italic;
          const color = edit.color;
          
          // Set font
          let fontStyle = '';
          if (bold) fontStyle += 'bold ';
          if (italic) fontStyle += 'italic ';
          ctx.font = `${fontStyle}${fontSize}px Helvetica, Arial, sans-serif`;
          ctx.fillStyle = color;
          ctx.fillText(text, x, y + fontSize);
          
          // Draw border around new text
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          const textWidth = ctx.measureText(text).width;
          ctx.strokeRect(x - 2, y, textWidth + 4, fontSize + 4);
        }
      }
      
      // DRAW SHAPE EDITS
      else if (editType === 'shape') {
        const shape = edit.shape;
        const x = edit.x * zoom;
        const y = edit.y * zoom;
        const width = edit.width * zoom;
        const height = edit.height * zoom;
        
        ctx.strokeStyle = edit.color;
        ctx.lineWidth = edit.strokeWidth;
        
        if (edit.fillColor) {
          ctx.fillStyle = edit.fillColor;
        }
        
        if (shape === 'rectangle') {
          if (edit.fillColor) ctx.fillRect(x, y, width, height);
          ctx.strokeRect(x, y, width, height);
        } else if (shape === 'circle') {
          const centerX = x + width / 2;
          const centerY = y + height / 2;
          const radius = Math.min(width, height) / 2;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          if (edit.fillColor) ctx.fill();
          ctx.stroke();
        } else if (shape === 'line') {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + width, y + height);
          ctx.stroke();
        }
      }
      
      // DRAW HIGHLIGHT
      else if (editType === 'highlight') {
        const x = edit.x * zoom;
        const y = edit.y * zoom;
        const width = edit.width * zoom;
        const height = edit.height * zoom;
        
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.fillRect(x, y, width, height);
      }
    });
  };

  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    const currentPageData = pdfPages[currentPage];
    if (!currentPageData) return;
    
    if (mode === 'select') {
      const clickedBlock = currentPageData.textBlocks.findIndex(block => {
        return (
          x >= block.x &&
          x <= block.x + block.width &&
          y >= block.y &&
          y <= block.y + block.height
        );
      });
      
      if (clickedBlock !== -1) {
        setSelectedTextBlock(clickedBlock);
        setShowTextOptions(true);
        const block = currentPageData.textBlocks[clickedBlock];
        setFontSize(Math.round(block.fontSize));
      } else {
        setSelectedTextBlock(null);
        setShowTextOptions(false);
      }
    } else if (mode === 'addText') {
      setShowTextOptions(true);
      const text = prompt('Enter text:');
      if (text) {
        addTextEdit(x, y, text);
      }
    } else if (mode === 'shape') {
      const width = 100;
      const height = 100;
      addShapeEdit(x, y, width, height);
    } else if (mode === 'highlight') {
      const width = 100;
      const height = 20;
      addHighlightEdit(x, y, width, height);
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!canvasRef.current || mode !== 'select') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    const currentPageData = pdfPages[currentPage];
    if (!currentPageData) return;
    
    const hoveredBlockIndex = currentPageData.textBlocks.findIndex(block => {
      return (
        x >= block.x &&
        x <= block.x + block.width &&
        y >= block.y &&
        y <= block.y + block.height
      );
    });
    
    setHoveredBlock(hoveredBlockIndex !== -1 ? hoveredBlockIndex : null);
  };

  const addTextEdit = (x, y, text) => {
    setEdits([...edits, {
      page: currentPage + 1,
      type: 'text',
      action: 'add',
      text: text,
      x: x,
      y: y,
      fontSize: fontSize,
      fontName: 'Helvetica',
      bold: isBold,
      italic: isItalic,
      color: fontColor,
      id: Date.now()
    }]);
  };

  const addShapeEdit = (x, y, width, height) => {
    setEdits([...edits, {
      page: currentPage + 1,
      type: 'shape',
      shape: shapeType,
      x: x,
      y: y,
      width: width,
      height: height,
      color: strokeColor,
      fillColor: fillColor || null,
      strokeWidth: strokeWidth,
      id: Date.now()
    }]);
  };

  const addHighlightEdit = (x, y, width, height) => {
    setEdits([...edits, {
      page: currentPage + 1,
      type: 'highlight',
      x: x,
      y: y,
      width: width,
      height: height,
      color: '#FFFF00',
      id: Date.now()
    }]);
  };

  const handleEditSelectedText = () => {
    if (selectedTextBlock === null) {
      alert('Please select a text block first');
      return;
    }
    
    const currentPageData = pdfPages[currentPage];
    const block = currentPageData.textBlocks[selectedTextBlock];
    
    const newText = prompt('Enter new text:', block.text);
    if (newText !== null && newText.trim() !== '') {
      setEdits([...edits, {
        page: currentPage + 1,
        type: 'text',
        action: 'replace',
        removeArea: {
          x: block.x,
          y: block.y,
          width: block.width,
          height: block.height
        },
        text: newText,
        x: block.x,
        y: block.y,
        fontSize: fontSize,
        fontName: 'Helvetica',
        bold: isBold,
        italic: isItalic,
        color: fontColor,
        id: Date.now()
      }]);
      
      setSelectedTextBlock(null);
      setShowTextOptions(false);
    }
  };

  const handleDeleteSelectedText = () => {
    if (selectedTextBlock === null) {
      alert('Please select a text block first');
      return;
    }
    
    const currentPageData = pdfPages[currentPage];
    const block = currentPageData.textBlocks[selectedTextBlock];
    
    if (confirm('Delete this text?')) {
      setEdits([...edits, {
        page: currentPage + 1,
        type: 'text',
        action: 'delete',
        removeArea: {
          x: block.x,
          y: block.y,
          width: block.width,
          height: block.height
        },
        id: Date.now()
      }]);
      
      setSelectedTextBlock(null);
      setShowTextOptions(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    files.forEach(file => {
      setImages([...images, file]);
      
      const x = (pdfPages[currentPage].width / 4);
      const y = (pdfPages[currentPage].height / 4);
      
      setEdits([...edits, {
        page: currentPage + 1,
        type: 'image',
        imageName: file.name,
        x: x,
        y: y,
        width: 200,
        height: 200,
        id: Date.now()
      }]);
    });
  };

  const removeEdit = (id) => {
    setEdits(edits.filter(edit => edit.id !== id));
  };

  const handleSave = async () => {
    if (edits.length === 0) {
      alert('No edits to save');
      return;
    }
    
    setLoading(true);
    
    try {
      const blob = await pdfService.editPdfComplete(selectedFile, edits, images);
      downloadBlob(blob, `edited_${selectedFile.name}`);
      alert('PDF saved successfully!');
    } catch (error) {
      console.error('Error saving PDF:', error);
      alert('Error saving PDF: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
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

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Type className="w-12 h-12 text-blue-400" />
              <div>
                <h1 className="text-4xl font-bold gradient-text">PDF Editor with Live Preview</h1>
                <p className="text-gray-400 mt-2 flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>See changes in real-time before downloading!</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {!pdfPages.length ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FileUpload
              onFilesSelected={handleFileSelect}
              acceptedFileTypes={acceptedTypes}
              multiple={false}
              maxFiles={1}
            />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* PDF Viewer */}
            <div className="lg:col-span-3">
              <div className="glass-card p-6">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className="btn-secondary text-sm px-3 py-2"
                    >
                      ←
                    </button>
                    <span className="text-sm">
                      {currentPage + 1} / {pdfPages.length}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(pdfPages.length - 1, currentPage + 1))}
                      disabled={currentPage === pdfPages.length - 1}
                      className="btn-secondary text-sm px-3 py-2"
                    >
                      →
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                      className="btn-secondary text-sm px-2 py-2"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm">{Math.round(zoom * 100)}%</span>
                    <button
                      onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                      className="btn-secondary text-sm px-2 py-2"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tools */}
                <div className="flex items-center space-x-2 mb-4 flex-wrap gap-2 pb-4 border-b border-white/10">
                  <button
                    onClick={() => {setMode('select'); setShowTextOptions(false);}}
                    className={`btn-${mode === 'select' ? 'primary' : 'secondary'} text-sm px-3 py-2`}
                    title="Select text"
                  >
                    <MousePointer className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => {setMode('addText'); setShowTextOptions(true);}}
                    className={`btn-${mode === 'addText' ? 'primary' : 'secondary'} text-sm px-3 py-2`}
                    title="Add text"
                  >
                    <Type className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => imageUploadRef.current?.click()}
                    className="btn-secondary text-sm px-3 py-2"
                    title="Add image"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <input
                    ref={imageUploadRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => {setMode('shape'); setShapeType('rectangle');}}
                    className={`btn-${mode === 'shape' && shapeType === 'rectangle' ? 'primary' : 'secondary'} text-sm px-3 py-2`}
                    title="Rectangle"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => {setMode('shape'); setShapeType('circle');}}
                    className={`btn-${mode === 'shape' && shapeType === 'circle' ? 'primary' : 'secondary'} text-sm px-3 py-2`}
                    title="Circle"
                  >
                    <Circle className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => {setMode('shape'); setShapeType('line');}}
                    className={`btn-${mode === 'shape' && shapeType === 'line' ? 'primary' : 'secondary'} text-sm px-3 py-2`}
                    title="Line"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => setMode('highlight')}
                    className={`btn-${mode === 'highlight' ? 'primary' : 'secondary'} text-sm px-3 py-2`}
                    title="Highlight"
                  >
                    <Highlighter className="w-4 h-4" />
                  </button>
                </div>

                {/* Text Formatting */}
                <AnimatePresence>
                  {showTextOptions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-4 bg-white/5 rounded-lg"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="text-xs text-gray-400">Font Size</label>
                          <input
                            type="number"
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                            className="w-full bg-white/10 rounded px-2 py-1 text-sm"
                            min="8"
                            max="72"
                          />
                        </div>
                        
                        <div>
                          <label className="text-xs text-gray-400">Color</label>
                          <input
                            type="color"
                            value={fontColor}
                            onChange={(e) => setFontColor(e.target.value)}
                            className="w-full h-8 bg-white/10 rounded cursor-pointer"
                          />
                        </div>
                        
                        <div className="flex items-end space-x-2">
                          <button
                            onClick={() => setIsBold(!isBold)}
                            className={`btn-${isBold ? 'primary' : 'secondary'} text-sm px-3 py-2 flex-1`}
                          >
                            <Bold className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setIsItalic(!isItalic)}
                            className={`btn-${isItalic ? 'primary' : 'secondary'} text-sm px-3 py-2 flex-1`}
                          >
                            <Italic className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {selectedTextBlock !== null && (
                          <div className="flex items-end space-x-2">
                            <button
                              onClick={handleEditSelectedText}
                              className="btn-primary text-sm px-3 py-2 flex-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={handleDeleteSelectedText}
                              className="btn-secondary text-sm px-3 py-2 text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Shape Options */}
                {mode === 'shape' && (
                  <div className="mb-4 p-4 bg-white/5 rounded-lg">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-gray-400">Stroke</label>
                        <input
                          type="color"
                          value={strokeColor}
                          onChange={(e) => setStrokeColor(e.target.value)}
                          className="w-full h-8 bg-white/10 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">Fill</label>
                        <input
                          type="color"
                          value={fillColor}
                          onChange={(e) => setFillColor(e.target.value)}
                          className="w-full h-8 bg-white/10 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">Width</label>
                        <input
                          type="number"
                          value={strokeWidth}
                          onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                          className="w-full bg-white/10 rounded px-2 py-1 text-sm"
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PDF Viewer with REAL-TIME PREVIEW */}
                <div className="relative overflow-auto bg-gray-800 rounded-lg max-h-[600px]">
                  <img
                    ref={imageRef}
                    src={pdfPages[currentPage]?.image}
                    alt={`Page ${currentPage + 1}`}
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: 'top left',
                      display: 'block'
                    }}
                    className="w-full"
                  />
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    onMouseMove={handleCanvasMouseMove}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      cursor: mode === 'select' ? 'pointer' : 'crosshair'
                    }}
                  />
                </div>

                <p className="text-sm text-green-400 mt-4 flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>
                    {mode === 'select' && '💡 Click on text to select and edit - See changes instantly!'}
                    {mode === 'addText' && '💡 Click to add new text - Preview in green border'}
                    {mode === 'shape' && '💡 Click to add shape - See it immediately'}
                    {mode === 'highlight' && '💡 Click to highlight - Yellow preview'}
                  </span>
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-4">
                <h3 className="text-xl font-bold mb-4">Changes ({edits.length})</h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                  {edits.length === 0 ? (
                    <p className="text-sm text-gray-400">No changes yet</p>
                  ) : (
                    edits.map((edit) => (
                      <div key={edit.id} className="bg-white/5 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-purple-400">
                            Page {edit.page} - {edit.type}
                          </span>
                          <button
                            onClick={() => removeEdit(edit.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {edit.text && (
                          <p className="text-sm font-medium truncate">{edit.text}</p>
                        )}
                        {edit.type === 'image' && (
                          <p className="text-xs text-gray-400">Image: {edit.imageName}</p>
                        )}
                        {edit.type === 'shape' && (
                          <p className="text-xs text-gray-400">Shape: {edit.shape}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {edits.length > 0 && (
                  <button
                    onClick={handleSave}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save PDF</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {loading && <LoadingSpinner message="Processing PDF..." />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdvancedEditPdfPage;