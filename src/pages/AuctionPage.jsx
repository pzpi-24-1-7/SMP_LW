import LotCard from '../components/LotCard';

const AuctionPage = ({ lots, favorites, onToggleFavorite }) => {
  return (
    <div>
      <h2>Доступні лоти</h2>
      <div className="grid">
        {lots.map(lot => (
          <LotCard 
            key={lot.id} 
            lot={lot} 
            isFavorite={favorites.includes(lot.id)}
            onToggleFavorite={onToggleFavorite} 
          />
        ))}
      </div>
    </div>
  );
};
export default AuctionPage;