import React, { useState } from 'react';

const Payment = ({ userDetails, address }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [card, setCard] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');

  const handlePay = () => {
    if (
      !userDetails.name ||
      !userDetails.number ||
      !userDetails.email ||
      !address.city ||
      !address.state
    ) {
      alert('Please complete user and address details.');
      return;
    }
    if (paymentMethod === 'card') {
      if (
        !/^\d{16}$/.test(card.cardNumber) ||
        !/^\d{2}\/\d{2}$/.test(card.expiry) ||
        !/^\d{3}$/.test(card.cvv)
      ) {
        alert('Invalid card details');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        setUpiError('Invalid UPI ID');
        return;
      }
      setUpiError('');
    }
    alert('Payment successful (simulated)');
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

      <button className="pay-now" onClick={handlePay}>
        Pay Now
      </button>
    </>
  );
};

export default Payment;
