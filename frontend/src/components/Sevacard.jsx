import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sevacard = ({ seva }) => {
  const navigate = useNavigate();

  const handleBookNow = (code) => {
    localStorage.setItem('sevaCode', code);
    navigate('/checkout');
  };

  return (
    <div className="seva-card">
      <img src={seva.media} alt={seva.title} className="seva-image" />
      <div className="seva-content">
        <h3>{seva.title}</h3>
        <p className="seva-desc">{seva.description}</p>
        <div className="seva-tags">
          {seva.tags.map((tag, index) => (
            <span key={index} className="seva-tag">
              #{tag}
            </span>
          ))}
        </div>
        <div className="seva-pricing">
          <span className="market">₹{seva.marketPrice}</span>
          <span className="discounted">₹{seva.discountedPrice}</span>
        </div>
        <button className="book-btn" onClick={() => handleBookNow(seva.code)}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Sevacard;
