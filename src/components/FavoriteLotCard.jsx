// 5.1 Розробити компонент FavoriteLotCard, який приймає екземпляр класу AuctionLot та відображає його на сторінці FavoritesPage
const FavoriteLotCard = ({ lot, onToggleFavorite }) => (
  <div className="card favorite-card">
    <img src={lot.imageUrl} alt={lot.title} />
    <h3>{lot.title} ♥</h3>
    <p>Ціна: ${lot.startPrice}</p>
    <button 
      className="btn-small-remove" 
      onClick={() => onToggleFavorite(lot.id)}
    >
      Видалити
    </button>
  </div>
);
export default FavoriteLotCard;