import React from 'react';
import Signup from './pages/auth/signup/Signup';
import Login from './pages/auth/Login/Login';
import Home from './pages/Home/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPael';

function App() {
  return (
    <BrowserRouter>
      <div className="flex max-w-6xl mx-auto">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        {/* <RightPanel /> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
