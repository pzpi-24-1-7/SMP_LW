import Header from './Header';
import Footer from './Footer';

// 6.1, 6.2 - Створити React-компонент Layout, який визначає загальну структуру сторінок
const Layout = ({ children }) => (
  <div className="layout">
    <Header />
    <main className="main-content">{children}</main>
    <Footer />
  </div>
);
export default Layout;