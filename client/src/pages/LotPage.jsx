import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const LotDetailsPage = () => {
  const { id } = useParams(); 
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/lots/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Лот не знайдено');
        return res.json();
      })
      .then(data => {
        setLot(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Завантаження...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
        &larr; Повернутися до всіх лотів
      </Link>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <img 
          src={lot.imageUrl || "https://images.ctfassets.net/sfnkq8lmu5d7/2fYz9PMIiZT8emz4lZPwUE/8f14aa0c3b0957899c52bc67f2e067f4/2025-06-26_cats_baby_face_hero.jpg?w=1200&h=960&fl=progressive&q=70&fm=jpg"} 
          alt={lot.title} 
          style={{ maxWidth: '400px', width: '100%', borderRadius: '8px', objectFit: 'cover' }}
        />
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h1 style={{ marginTop: 0 }}>{lot.title}</h1>
          <p style={{ color: '#666', fontSize: '18px' }}>Категорія: <strong>{lot.category}</strong></p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', margin: '20px 0' }}>{lot.startPrice} грн</p>
          
          {/* СТРОКА З ЛІЧИЛЬНИКОМ ПЕРЕГЛЯДІВ */}
          <div style={{ padding: '10px 15px', backgroundColor: '#e9ecef', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>👁️</span>
            <span style={{ fontSize: '18px', fontWeight: '500' }}>Переглядів: {lot.views || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotDetailsPage;