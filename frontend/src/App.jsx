import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ConvertPage from './pages/ConvertPage';
import MergePage from './pages/MergePage';
import ExtractTextPage from './pages/ExtractTextPage';
import ExtractTablesPage from './pages/ExtractTablesPage';
import SplitPage from './pages/SplitPage';
import RotatePage from './pages/RotatePage';
import WatermarkPage from './pages/WatermarkPage';
import EncryptPage from './pages/EncryptPage';
import AdvancedEditPdfPage from './pages/AdvancedEditPdfPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit" element={<AdvancedEditPdfPage />} />
          <Route path="/convert" element={<ConvertPage />} />
          <Route path="/merge" element={<MergePage />} />
          <Route path="/extract-text" element={<ExtractTextPage />} />
          <Route path="/extract-tables" element={<ExtractTablesPage />} />
          <Route path="/split" element={<SplitPage />} />
          <Route path="/rotate" element={<RotatePage />} />
          <Route path="/watermark" element={<WatermarkPage />} />
          <Route path="/encrypt" element={<EncryptPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;