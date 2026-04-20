import LotCard from '../components/LotCard';
import CreateLotForm from '../components/CreateLotForm';

const AuctionPage = ({ lots, favorites, onToggleFavorite, onAddLot, onDeleteLot }) => {
  return (
    <div className="page-container">
      <h2>Аукціон</h2>
      
      <CreateLotForm onAdd={onAddLot} />

      <div className="lots-grid">
        {lots.map(lot => (
          <LotCard 
            key={lot.id} 
            lot={lot} 
            isFavorite={favorites.includes(lot.id)} 
            onToggleFavorite={onToggleFavorite}
            onDelete={onDeleteLot}
          />
        ))}
      </div>
    </div>
  );
};

export default AuctionPage;