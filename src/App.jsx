import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ImageGallery from './Components/ImageGallery';
import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';
import About from './Components/About';
import Contact from './Components/Contact';
import Dashboard from './Components/Dashboard';
import Basket from './Components/Basket';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Отправляем hit с текущим URL при каждом изменении маршрута
    if (window.ym) {
      window.ym(98729754, 'hit', location.pathname);
    }
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<ImageGallery />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/basket" element={<Basket />} />
      </Routes>
    </>
  );
}

export default App;
