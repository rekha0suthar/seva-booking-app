import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [latestOrders, setLatestOrders] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
      setUserInfo(res.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/${userId}/latest`
      );
      setLatestOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const handleUserClick = () => {
    if (!userId) {
      navigate('/checkout');
    } else {
      setShowDropdown((prev) => !prev);
      if (userId) {
        fetchUserData();
        fetchUserOrders();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    window.location.reload();
  };
  return (
    <>
      <nav className="navbar">
        <h2 onClick={() => navigate('/')}>Seva Booking</h2>

        <ul className="navbar-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/checkout">Cart</Link>
          </li>
          {userId && (
            <li className="nav-user" onClick={handleUserClick}>
              {' '}
              👤 User
            </li>
          )}
        </ul>
      </nav>
      <div className="nav-user-wrapper">
        {showDropdown && userInfo && (
          <div className="user-dropdown">
            <p>
              <strong>{userInfo.name}</strong>
            </p>
            <p>{userInfo.email}</p>
            <p>{userInfo.contact}</p>
            <hr />
            <h4>Latest Orders</h4>
            {latestOrders.length === 0 ? (
              <p>No recent orders</p>
            ) : (
              latestOrders.map((order, index) => (
                <p key={order._id}>
                  Order #{index + 1}: {order._id.slice(-6)}
                </p>
              ))
            )}
            <hr />
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
