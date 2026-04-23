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
  const badgeStyle = {
    padding: '6px 12px',
    backgroundColor: '#F6F8F9',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#555',
    border: '1px solid #E1E4E8'
  };
  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
        &larr; Повернутися до всіх лотів
      </Link>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <img 
          src={lot.imageUrl || "https://images.ctfassets.net/sfnkq8lmu5d7/2fYz9PMIiZT8emz4lZPwUE/8f14aa0c3b0957899c52bc67f2e067f4/2025-06-26_cats_baby_face_hero.jpg?w=1200&h=960&fl=progressive&q=70&fm=jpg"} 
          alt={lot.title} 
          style={{ maxWidth: '400px', width: '100%', borderRadius: '8px', objectFit: 'cover' }}
        />

        <div style={{ width: '100%', textAlign: 'center' }}>
          <h1 style={{ color: '#2C2429', fontSize: '32px', marginBottom: '10px' }}>{lot.title}</h1>
          <p style={{ color: '#555', fontSize: '18px' }}>Категорія: <strong>{lot.category}</strong></p>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#2C2429', margin: '20px 0' }}>{lot.startPrice} грн</p>
          
          <div style={{ 
            padding: '8px 16px', 
            backgroundColor: '#F6F8F9', 
            borderRadius: '20px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            border: '1px solid #ddd'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span style={{ fontSize: '16px', color: '#666', fontWeight: '500' }}>Переглядів: {lot.total_hits || 0}</span>
          </div>
          <div style={{ marginTop: '25px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
<span style={badgeStyle}>
    <strong>{lot.total_hits}</strong> Всього переглядів
  </span>
  <span style={badgeStyle}>
    <strong>{lot.unique_hosts}</strong> Унікальних
  </span>
  <span style={{...badgeStyle, backgroundColor: '#E7F3FF', color: '#007bff', borderColor: '#BADCFF'}}>
    <strong>{lot.user_hits}</strong> з поточного ip
  </span>
</div>
        </div>
      </div>
    </div>
  );
};

export default LotDetailsPage;