import { Link } from 'react-router-dom';
import FavoriteLotCard from '../components/FavoriteLotCard';

// 7.2 - Створити сторінку FavoritesPage (додані в улюблене лоти); 
const FavoritesPage = ({ lots, favorites }) => {
  const favoriteLots = lots.filter(lot => favorites.includes(lot.id));

  return (
    <div>
      <h2>Моє улюблене</h2>
      {favoriteLots.length === 0 ? (
        <div className="empty-state">
          <p>Список порожній</p>
          <Link to="/" className="link-button">Перейти до аукціонів</Link>
        </div>
      ) : (
        <div className="grid">
          {favoriteLots.map(lot => (
            <FavoriteLotCard key={lot.id} lot={lot} />
          ))}
        </div>
      )}
    </div>
  );
};
export default FavoritesPage;