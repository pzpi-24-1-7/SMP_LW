import { Link } from 'react-router-dom';

const Header = () => (
  <header className="header">
    <Link to="/" style={{ textDecoration: 'none' }}>
      <h1 className="logo-text">Pastly</h1>
    </Link>
    
    <nav>
      <Link to="/">Усі аукціони</Link>
      <Link to="/favorites">Улюблене</Link>
    </nav>
  </header>
);

export default Header;