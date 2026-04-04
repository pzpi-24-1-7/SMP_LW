const FavoriteLotCard = ({ lot }) => (
  <div className="card favorite-card">
    <img src={lot.imageUrl} alt={lot.title} />
    <h3>{lot.title} ⭐</h3>
    <p>Ціна: ${lot.startPrice}</p>
  </div>
);
export default FavoriteLotCard;