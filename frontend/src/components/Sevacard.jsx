import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { addItem } from '../redux/cartSlice';

const Sevacard = ({ seva }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBookNow = () => {
    // Add to cart first
    dispatch(addItem(seva));
    // Navigate to checkout
    navigate('/checkout');
  };

  return (
    <div className="seva-card">
      <img src={seva.media} alt={seva.title} className="seva-image" />
      <div className="seva-content">
        <h3 className="seva-title">{seva.title}</h3>
        <p className="seva-desc">{seva.description}</p>
        
        {seva.tags && seva.tags.length > 0 && (
          <div className="seva-tags">
            {seva.tags.map((tag, index) => (
              <span key={index} className="seva-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="seva-pricing">
          <span className="market-price">₹{seva.marketPrice}</span>
          <span className="discounted-price">₹{seva.discountedPrice}</span>
          {seva.marketPrice > seva.discountedPrice && (
            <span className="discount-badge">
              {Math.round(((seva.marketPrice - seva.discountedPrice) / seva.marketPrice) * 100)}% OFF
            </span>
          )}
        </div>
        
        <button 
          className="book-btn"
          onClick={handleBookNow}
          aria-label={`Book ${seva.title} for ₹${seva.discountedPrice}`}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

Sevacard.propTypes = {
  seva: PropTypes.shape({
    code: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    media: PropTypes.string.isRequired,
    marketPrice: PropTypes.number.isRequired,
    discountedPrice: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default Sevacard;
