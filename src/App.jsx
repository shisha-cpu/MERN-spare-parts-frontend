import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

import ImageGallery from "./Components/ImageGallery";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Dashboard from "./Components/Dashboard";
import Basket from "./Components/Basket";
import ProductPage from "./Components/ProductPage";

function App() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.ym !== "undefined") {
      window.ym(98729754, "hit", location.pathname);
    }
  }, [location]);

  return (
    <>
      <Helmet>
        <meta property="og:title" content="Refvrn - запчасти для рефрижераторов" />
        <meta property="og:description" content="Продажа запчастей для рефрижераторов. Отличные цены и большой выбор." />
        <meta property="og:url" content="https://www.refvrn.com" />
        <meta property="og:image" content="/path/to/social-image.jpg" />
        <meta name="robots" content="index, follow" />
        <meta name="description" content="Большой каталог запчастей для Thermo King и Carrier. Закажите детали для рефрижераторов с доставкой по выгодной цене." />
      </Helmet>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<ImageGallery />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/catalog/:article" element={<ProductPage />} />
      </Routes>
    </>
  );
}

export default App;
