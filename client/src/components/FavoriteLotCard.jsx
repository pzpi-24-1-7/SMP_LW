// 5.1 Розробити компонент FavoriteLotCard, який приймає екземпляр класу AuctionLot та відображає його на сторінці FavoritesPage
const FavoriteLotCard = ({ lot, onToggleFavorite }) => (
  <div className="card favorite-card">
    <img src={lot.imageUrl ||"https://images.ctfassets.net/sfnkq8lmu5d7/2fYz9PMIiZT8emz4lZPwUE/8f14aa0c3b0957899c52bc67f2e067f4/2025-06-26_cats_baby_face_hero.jpg?w=1200&h=960&fl=progressive&q=70&fm=jpg"} alt={lot.title} />
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