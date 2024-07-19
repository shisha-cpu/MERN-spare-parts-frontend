import React from 'react';
import ImageGallery from './Components/ImageGallery';
import {Routes , Route  } from 'react-router-dom'
import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';
import About from './Components/About';
import Contact from './Components/Contact';
function App() {
  console.log('sasa-');
  return (
    <>
      <Routes>
       <Route path='/' element={<Home />} />
        <Route path='/catalog' element={<ImageGallery />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
      
    </>
  );
}

export default App;
