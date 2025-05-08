import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { Navigate, useNavigate } from 'react-router-dom';

const Payment = ({ userDetails, address }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [card, setCard] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');
  const cart = useSelector((state) => state.cart?.items || []);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePlaceOrder = async () => {
    const selectedItems = cart.map(({ code, title, discountedPrice }) => ({
      code,
      title,
      discountedPrice,
    }));

    // Validate
    if (!userDetails.name || !userDetails.number) {
      return alert('Please complete user details');
    }
    if (!address.city || !address.state || !address.pincode) {
      return alert('Please complete address');
    }

    // Simulate payment validation
    if (paymentMethod === 'card') {
      if (
        !/^\d{16}$/.test(card.cardNumber) ||
        !/^\d{2}\/\d{2}$/.test(card.expiry) ||
        !/^\d{3}$/.test(card.cvv)
      ) {
        return alert('Invalid card details');
      }
    } else if (paymentMethod === 'upi') {
      if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        return alert('Invalid UPI ID');
      }
    }

    try {
      // 1. Save address
      await axios.post('http://localhost:5000/api/address', {
        ...address,
        userContact: userDetails.number,
      });

      // 2. Create order
      const res = await axios.post('http://localhost:5000/api/orders', {
        items: selectedItems,
        address,
        userContact: userDetails.number,
      });

      alert(`Order placed! Order ID: ${res.data.orderId}`);
      dispatch(clearCart());
      localStorage.removeItem('sevaCode');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to place order');
    }
  };

  return (
    <>
      <h3>Payment Portal</h3>
      <div className="payment-methods">
        <label>
          <input
            type="radio"
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
          />{' '}
          Card
        </label>
        <label>
          <input
            type="radio"
            checked={paymentMethod === 'upi'}
            onChange={() => setPaymentMethod('upi')}
          />{' '}
          UPI
        </label>
      </div>

      {paymentMethod === 'card' && (
        <>
          <input
            placeholder="Card Number"
            value={card.cardNumber}
            onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}
          />
          <input
            placeholder="Expiry (MM/YY)"
            value={card.expiry}
            onChange={(e) => setCard({ ...card, expiry: e.target.value })}
          />
          <input
            placeholder="CVV"
            value={card.cvv}
            onChange={(e) => setCard({ ...card, cvv: e.target.value })}
          />
        </>
      )}

      {paymentMethod === 'upi' && (
        <>
          <input
            placeholder="UPI ID (e.g. name@bank)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
          {upiError && <p className="error">{upiError}</p>}
        </>
      )}

      <button className="pay-now" onClick={handlePlaceOrder}>
        Pay & Place Order
      </button>
    </>
  );
};

export default Payment;
