import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuctionPage from './pages/AuctionPage';
import FavoritesPage from './pages/FavoritesPage';
import LotPage from './pages/LotPage';
import { AuctionLot } from './models/AuctionLot';
import './App.css';

function App() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    fetch('http://localhost:3000/api/lots')
      .then(res => res.json())
      .then(data => {
        const lotInstances = data.map(item => new AuctionLot(item));
        setLots(lotInstances);
        setLoading(false);
      })
      .catch(err => {
        console.error("Помилка завантаження:", err);
        setLoading(false);
      });
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id]
    );
  };

  const addLot = async (newLotData) => {
    try {
      const response = await fetch('http://localhost:3000/api/lots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLotData)
      });
      
      if (response.ok) {
        const result = await response.json();
        const newLot = new AuctionLot({ ...newLotData, id: result.id });
        setLots(prev => [newLot, ...prev]);
      }
    } catch (error) {
      console.error("Помилка створення лоту:", error);
    }
  };

  const deleteLot = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/lots/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setLots(prev => prev.filter(lot => lot.id !== id));
        setFavorites(prev => prev.filter(favId => favId !== id));
      }
    } catch (error) {
      console.error("Помилка видалення лоту:", error);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Завантаження лотів...</div>;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route 
            path="/" 
            element={
              <AuctionPage 
                lots={lots} 
                favorites={favorites} 
                onToggleFavorite={toggleFavorite}
                onAddLot={addLot}       
                onDeleteLot={deleteLot} 
              />
            } 
          />
          <Route path="/lot/:id" element={<LotPage/>} />
          <Route 
            path="/favorites" 
            element={
              <FavoritesPage 
                lots={lots} 
                favorites={favorites} 
                onToggleFavorite={toggleFavorite}
              />
            } 
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;