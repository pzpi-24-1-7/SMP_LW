import { Link } from 'react-router-dom';

const FavoriteLotCard = ({ lot, onToggleFavorite }) => (
  <div className="card favorite-card" style={{ position: 'relative' }}>
    <Link to={`/lot/${lot.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <img 
        src={lot.imageUrl || "https://placehold.net/main.svg" || "https://images.ctfassets.net/sfnkq8lmu5d7/2fYz9PMIiZT8emz4lZPwUE/8f14aa0c3b0957899c52bc67f2e067f4/2025-06-26_cats_baby_face_hero.jpg?w=1200&h=960&fl=progressive&q=70&fm=jpg"} 
        alt={lot.title} 
      />
      <div style={{ padding: '10px 0' }}>
        <h3 style={{ margin: '5px 0' }}>{lot.title} <span style={{ color: '#df8090' }}>♥</span></h3>
        <p className="card-p-bold">Ціна: {lot.startPrice} грн</p>
      </div>
    </Link>

    <button 
      className="btn-active" 
      style={{ marginTop: '5px', fontSize: '12px', padding: '8px' }}
      onClick={(e) => {
        e.preventDefault();
        onToggleFavorite(lot.id);
      }}
    >
      Видалити з обраного
    </button>
  </div>
);

export default FavoriteLotCard;