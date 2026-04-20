import { Link } from 'react-router-dom';

const Header = () => (
  <header className="header">
    <h1>Pastly</h1>
    <nav>
      <Link to="/">Усі аукціони</Link>
      <Link to="/favorites">Улюблене</Link>
    </nav>
  </header>
);
export default Header;