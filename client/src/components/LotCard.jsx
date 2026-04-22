import { Link } from 'react-router-dom';

const LotCard = ({ lot, isFavorite, onToggleFavorite, onDelete }) => (
  <div className="card">
    
    <Link to={`/lot/${lot.id}`} style={{ display: 'block', overflow: 'hidden' }}>
      <img 
        src={lot.imageUrl || 'https://placehold.net/main.svg'} 
        alt={lot.title} 
        style={{ transition: 'transform 0.3s ease', display: 'block', width: '100%' }} 
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} 
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      />
    </Link>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <h3 style={{ margin: 0 }}>
        <Link to={`/lot/${lot.id}`} style={{ textDecoration: 'none', color: '#333' }}>
          {lot.title}
        </Link>
      </h3>

      <span style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '5px', 
        backgroundColor: '#f1f3f5', 
        padding: '4px 8px', 
        borderRadius: '12px', 
        fontSize: '12px', 
        color: '#495057',
        fontWeight: 'bold'
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        {lot.views || 0}
      </span>
    </div>

    
    <p>Категорія: {lot.category}</p>
    <p className="card-p-bold">Ціна: {lot.startPrice} грн</p>
    
    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
      <button 
        onClick={() => onToggleFavorite(lot.id)}
        className={isFavorite ? "btn-active" : "btn-default"}
      >
        {isFavorite ? "Видалити з улюбленого" : "В улюблене"}
      </button>
      
      <button 
        onClick={() => onDelete(lot.id)}
        style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}
      >
        Видалити лот
      </button>
    </div>
    
    <Link to={`/lot/${lot.id}`} style={{ display: 'block', textAlign: 'center', marginTop: '10px', textDecoration: 'none', color: '#007bff' }}>
      Дивитись деталі &rarr;
    </Link>
  </div>
);

export default LotCard;