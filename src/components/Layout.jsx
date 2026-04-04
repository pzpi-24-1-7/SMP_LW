import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => (
  <div className="layout">
    <Header />
    <main className="main-content">{children}</main>
    <Footer />
  </div>
);
export default Layout;