import React from 'react';

const Sevacard = ({ seva }) => {
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
      </div>
    </div>
  );
};

export default Sevacard;
