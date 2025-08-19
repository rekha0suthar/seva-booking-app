import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  updatePaymentMethod, 
  updateCardDetails, 
  updateUpiId, 
  placeOrder,
  clearOrderError 
} from '../redux/checkoutSlice';
import { clearCart } from '../redux/cartSlice';
import { resetCheckout } from '../redux/checkoutSlice';
import Loading from './Loading';
import Error from './Error';
import PropTypes from 'prop-types';

const Payment = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { payment, order } = useSelector((state) => state.checkout);
  const { items, total } = useSelector((state) => state.cart);
  const { userDetails } = useSelector((state) => state.user);
  const { address } = useSelector((state) => state.checkout);

  const [validationError, setValidationError] = useState('');

  const validateCardDetails = () => {
    const { cardNumber, expiry, cvv } = payment.card;
    if (!/^\d{16}$/.test(cardNumber)) {
      return 'Invalid card number (16 digits required)';
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      return 'Invalid expiry date (MM/YY format)';
    }
    if (!/^\d{3}$/.test(cvv)) {
      return 'Invalid CVV (3 digits required)';
    }
    return null;
  };

  const validateUpiId = () => {
    if (!/^[\w.-]+@[\w.-]+$/.test(payment.upiId)) {
      return 'Invalid UPI ID format (e.g., name@bank)';
    }
    return null;
  };

  const handlePaymentMethodChange = (method) => {
    dispatch(updatePaymentMethod(method));
    setValidationError('');
  };

  const handleCardInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
    } else if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      }
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }
    
    dispatch(updateCardDetails({ [field]: formattedValue }));
    setValidationError('');
  };

  const handleUpiChange = (value) => {
    dispatch(updateUpiId(value));
    setValidationError('');
  };

  const handlePlaceOrder = async () => {
    setValidationError('');

    // Validate user details
    if (!userDetails.name || !userDetails.email) {
      setValidationError('Please complete user details first');
      return;
    }

    // Validate address
    if (!address.addrLine1 || !address.pincode || !address.city || !address.state) {
      setValidationError('Please complete address details first');
      return;
    }

    // Validate cart
    if (items.length === 0) {
      setValidationError('Please add items to cart first');
      return;
    }

    // Validate payment method
    if (payment.method === 'card') {
      const cardError = validateCardDetails();
      if (cardError) {
        setValidationError(cardError);
        return;
      }
    } else if (payment.method === 'upi') {
      const upiError = validateUpiId();
      if (upiError) {
        setValidationError(upiError);
        return;
      }
    }

    try {
      const orderData = {
        items: items.map(({ code, title, discountedPrice }) => ({
          code,
          title,
          discountedPrice,
        })),
        address,
        userContact: userDetails.contact,
        paymentMethod: payment.method,
        total,
      };

      const result = await dispatch(placeOrder(orderData)).unwrap();
      
      alert(`Order placed successfully! Order ID: ${result.orderId || result._id}`);
      
      // Clear cart and reset checkout
      dispatch(clearCart());
      dispatch(resetCheckout());
      localStorage.removeItem('sevaCode');
      
      if (onSuccess) {
        onSuccess();
      }
      navigate('/');
      
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  const handleRetry = () => {
    dispatch(clearOrderError());
    handlePlaceOrder();
  };

  if (order.loading) {
    return <Loading text="Processing your order..." />;
  }

  return (
    <div className="payment-container">
      <h3>Payment Details</h3>

      {order.error && (
        <Error 
          message={order.error} 
          onRetry={handleRetry}
          className="payment-error"
        />
      )}

      {validationError && (
        <div className="validation-error">
          <p>{validationError}</p>
        </div>
      )}

      <div className="payment-methods">
        <label className="payment-method">
          <input
            type="radio"
            checked={payment.method === 'card'}
            onChange={() => handlePaymentMethodChange('card')}
          />
          <span>Credit/Debit Card</span>
        </label>
        <label className="payment-method">
          <input
            type="radio"
            checked={payment.method === 'upi'}
            onChange={() => handlePaymentMethodChange('upi')}
          />
          <span>UPI</span>
        </label>
      </div>

      {payment.method === 'card' && (
        <div className="card-payment">
          <div className="form-group">
            <input
              type="text"
              placeholder="Card Number"
              value={payment.card.cardNumber}
              onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
              className="form-input"
              maxLength={19}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="MM/YY"
                value={payment.card.expiry}
                onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                className="form-input"
                maxLength={5}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="CVV"
                value={payment.card.cvv}
                onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                className="form-input"
                maxLength={3}
              />
            </div>
          </div>
        </div>
      )}

      {payment.method === 'upi' && (
        <div className="upi-payment">
          <div className="form-group">
            <input
              type="text"
              placeholder="UPI ID (e.g., name@bank)"
              value={payment.upiId}
              onChange={(e) => handleUpiChange(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      )}

      <div className="order-summary">
        <h4>Order Summary</h4>
        <p>Total Amount: ₹{total}</p>
      </div>

      <button 
        onClick={handlePlaceOrder}
        className="btn btn-primary pay-now"
        disabled={order.loading}
      >
        {order.loading ? 'Processing...' : 'Pay & Place Order'}
      </button>
    </div>
  );
};

Payment.propTypes = {
  onSuccess: PropTypes.func,
};

export default Payment;
