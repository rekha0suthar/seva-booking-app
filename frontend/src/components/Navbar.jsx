import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>Seva Booking</h2>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/checkout">Cart</Link>
        </li>
        <li>
          <Link to="/">User</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
