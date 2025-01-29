import React from 'react';
import './styles/App.css'; // Global styles
import './styles/Navbar.css'; // Navbar-specific styles
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ReviewGenerator from './components/ReviewGenerator';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav>
          <div className="navbar-title">
            <Link to="/">Review Generator App</Link>
          </div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<ReviewGenerator />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
