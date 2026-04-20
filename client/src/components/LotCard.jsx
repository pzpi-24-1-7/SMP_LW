const LotCard = ({ lot, isFavorite, onToggleFavorite, onDelete }) => (
  <div className="card">
    <img src={lot.imageUrl || "https://images.ctfassets.net/sfnkq8lmu5d7/2fYz9PMIiZT8emz4lZPwUE/8f14aa0c3b0957899c52bc67f2e067f4/2025-06-26_cats_baby_face_hero.jpg?w=1200&h=960&fl=progressive&q=70&fm=jpg"} alt={lot.title} />
    <h3>{lot.title}</h3>
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
  </div>
);

export default LotCard;