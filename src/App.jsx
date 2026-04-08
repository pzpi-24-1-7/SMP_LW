import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuctionPage from './pages/AuctionPage';
import FavoritesPage from './pages/FavoritesPage';
import { lotsData } from './models/AuctionLot';
import './App.css';

function App() {
  // 7.2 - Ідентифікатори улюблених лотів мають зберігатися у localStorage браузера.
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);


  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id]
    );
  };

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route 
            path="/" 
            element={<AuctionPage lots={lotsData} favorites={favorites} onToggleFavorite={toggleFavorite} />} 
          />
          <Route 
            path="/favorites" 
            element={<FavoritesPage lots={lotsData} favorites={favorites} />} 
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;