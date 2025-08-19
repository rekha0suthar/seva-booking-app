import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, fetchUserProfile } from '../redux/userSlice';
import { clearCart } from '../redux/cartSlice';
import Loading from './Loading';
import Error from './Error';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, profile, loading, error, data: userData, userDetails } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [latestOrders, setLatestOrders] = useState([]);
  const [profileFetched, setProfileFetched] = useState(false);

  const userId = localStorage.getItem('userId');

  // Debug logging
  useEffect(() => {
    console.log('Navbar - State:', { 
      isAuthenticated, 
      profile, 
      loading, 
      error, 
      userId, 
      profileFetched,
      userData,
      userDetails
    });
  }, [isAuthenticated, profile, loading, error, userId, profileFetched, userData, userDetails]);

  // Fetch profile when component mounts if authenticated
  useEffect(() => {
    if (userId && isAuthenticated && !profileFetched) {
      console.log('Navbar - Fetching profile on mount for userId:', userId);
      dispatch(fetchUserProfile(userId));
      setProfileFetched(true);
    } else if (!userId && isAuthenticated) {
      console.warn('Navbar - User is authenticated but no userId in localStorage');
      // Try to get userId from userData
      if (userData?._id) {
        console.log('Navbar - Using userId from userData:', userData._id);
        localStorage.setItem('userId', userData._id);
        dispatch(fetchUserProfile(userData._id));
        setProfileFetched(true);
      }
    }
  }, [userId, isAuthenticated, dispatch, profileFetched, userData]);

  const handleUserClick = async () => {
    if (!isAuthenticated) {
      navigate('/checkout');
    } else {
      const newShowDropdown = !showDropdown;
      setShowDropdown(newShowDropdown);
      
      // Get current userId (might have been updated)
      const currentUserId = localStorage.getItem('userId') || userData?._id;
      
      // Fetch profile when dropdown is opened if not already loaded
      if (newShowDropdown && currentUserId && !profile && !loading) {
        console.log('Navbar - Fetching user profile on dropdown open for userId:', currentUserId);
        try {
          await dispatch(fetchUserProfile(currentUserId)).unwrap();
        } catch (error) {
          console.error('Navbar - Failed to fetch profile:', error);
        }
      } else if (newShowDropdown && !currentUserId) {
        console.warn('Navbar - Cannot fetch profile: no userId available');
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    setShowDropdown(false);
    setProfileFetched(false);
    navigate('/');
  };

  const handleRetry = async () => {
    const currentUserId = localStorage.getItem('userId') || userData?._id;
    if (currentUserId) {
      console.log('Navbar - Retrying profile fetch for userId:', currentUserId);
      try {
        await dispatch(fetchUserProfile(currentUserId)).unwrap();
      } catch (error) {
        console.error('Navbar - Retry failed:', error);
      }
    } else {
      console.error('Navbar - Cannot retry: no userId available');
    }
  };

  const cartItemCount = items.length;

  // Get the best available user information
  const getUserInfo = () => {
    // Priority: profile > userDetails > userData
    if (profile && (profile.name || profile.email)) {
      return {
        name: profile.name || 'User',
        email: profile.email || 'No email',
        contact: profile.contact || 'No contact'
      };
    }
    
    if (userDetails && (userDetails.name || userDetails.email)) {
      return {
        name: userDetails.name || 'User',
        email: userDetails.email || 'No email',
        contact: userDetails.contact || 'No contact'
      };
    }
    
    if (userData) {
      return {
        name: userData.name || 'User',
        email: userData.email || 'No email',
        contact: userData.contact || 'No contact'
      };
    }
    
    return {
      name: 'User',
      email: 'No email',
      contact: 'No contact'
    };
  };

  // Determine what to show in dropdown
  const renderDropdownContent = () => {
    console.log('Navbar - Rendering dropdown content:', { loading, error, profile, userId });
    
    if (loading) {
      return <Loading size="small" text="Loading profile..." />;
    }
    
    if (error) {
      return (
        <Error 
          message={`Failed to load profile: ${error}`} 
          onRetry={handleRetry}
          className="profile-error"
        />
      );
    }
    
    // Always show user info, even if profile fetch failed
    const userInfo = getUserInfo();
    
    return (
      <>
        <div className="user-info">
          <p className="user-name">
            <strong>{userInfo.name}</strong>
          </p>
          <p className="user-email">{userInfo.email}</p>
          <p className="user-contact">{userInfo.contact}</p>
        </div>
        
        <hr />
        
        <div className="latest-orders">
          <h4>Latest Orders</h4>
          {latestOrders.length === 0 ? (
            <p className="no-orders">No recent orders</p>
          ) : (
            latestOrders.map((order, index) => (
              <p key={order._id} className="order-item">
                Order #{index + 1}: {order._id.slice(-6)}
              </p>
            ))
          )}
        </div>
        
        <hr />
        
        <button 
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </button>
      </>
    );
  };

  return (
    <>
      <nav className="navbar">
        <h2 onClick={() => navigate('/')} className="navbar-brand">
          Seva Booking
        </h2>

        <ul className="navbar-menu">
          <li>
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li>
            <Link to="/checkout" className="nav-link">
              Cart {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </Link>
          </li>
          {isAuthenticated && (
            <li className="nav-user" onClick={handleUserClick}>
              👤 User
            </li>
          )}
        </ul>
      </nav>
      
      <div className="nav-user-wrapper">
        {showDropdown && isAuthenticated && (
          <div className="user-dropdown">
            {renderDropdownContent()}
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
