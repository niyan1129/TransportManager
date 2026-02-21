// src/App.jsx

import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';

import Layout from './pages/Layout';
import Home from './pages/Home';
import Driver from './pages/Driver';
import Vehicle from './pages/Vehicle';
import Trip from './pages/Trip';
import About from './pages/About';
import NoPage from './pages/NoPage';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';



function App() {
  return (
    <MantineProvider>
      <LanguageProvider> 
        <BrowserRouter basename="/assessment02" > 
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="drivers" element={<Driver />} />
              <Route path="vehicles" element={<Vehicle />} />
              <Route path="trips" element={<Trip />} />
              <Route path="about" element={<About />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </MantineProvider>
  );
}

export default App;

