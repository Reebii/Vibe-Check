import React from 'react';
import VibeCheckApp from './VibeCheckApp';
import './App.css'; // Create this file for global styles

function App() {
  return (
    <div className="cosmic-app-container">
      {/* This wrapper div helps with cosmic background effects */}
      <div className="cosmic-background-overlay"></div>
      
      {/* Main App Component */}
      <VibeCheckApp />
      
      {/* Global UI Elements */}
      <footer className="cosmic-footer">
        <p>🌠 Your cosmic journey awaits 🌠</p>
      </footer>
    </div>
  );
}

export default App;