// 2.1 Створити компонент LotCard, який відображає об’єкт класу AuctionLot на сторінці
const LotCard = ({ lot, isFavorite, onToggleFavorite }) => (
  <div className="card">
    <img src={lot.imageUrl} alt={lot.title} />
    <h3>{lot.title}</h3>
    <p>Категорія: {lot.category}</p>
    <p className="card-p-bold">Ціна: {lot.startPrice} грн</p>
    <button 
      onClick={() => onToggleFavorite(lot.id)}
      className={isFavorite ? "btn-active" : "btn-default"}
    >
      {isFavorite ? "Видалити з улюбленого" : "В улюблене"}
    </button>
  </div>
);
export default LotCard;