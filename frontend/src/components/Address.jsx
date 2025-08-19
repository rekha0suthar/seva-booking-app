import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { updateAddress, validatePincode, setStep, clearPincodeError } from '../redux/checkoutSlice';
import Loading from './Loading';
import Error from './Error';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
];

const Address = ({ onContinue }) => {
  const dispatch = useDispatch();
  const { address, pincodeValidation } = useSelector((state) => state.checkout);

  // Debug log to track address state changes
  useEffect(() => {
    console.log('Address component - address state:', address);
  }, [address]);

  const handleInputChange = (field, value) => {
    console.log('Address - updating field:', field, 'value:', value);
    dispatch(updateAddress({ [field]: value }));
    
    // Clear pincode error when user starts typing in pincode field
    if (field === 'pincode') {
      dispatch(clearPincodeError());
    }
    
    // Clear pincode error when user manually types city or state
    if (field === 'city' || field === 'state') {
      dispatch(clearPincodeError());
    }
  };

  const handlePincodeBlur = async () => {
    if (address.pincode && address.pincode.length === 6) {
      try {
        console.log('Address - validating pincode:', address.pincode);
        
        // Add a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        const validationPromise = dispatch(validatePincode(address.pincode)).unwrap();
        
        const result = await Promise.race([validationPromise, timeoutPromise]);
        console.log('Address - pincode validation result:', result);
      } catch (error) {
        console.log('Address - pincode validation failed:', error);
        // Error is already handled in the slice, no need to throw
        // The error will be displayed to the user and they can enter manually
      }
    }
  };

  const handleContinue = () => {
    if (!address.addrLine1 || !address.pincode || !address.city || !address.state) {
      alert('Please fill in all required address fields');
      return;
    }
    
    console.log('Address - continuing to payment with address:', address);
    dispatch(setStep('payment'));
    if (onContinue) onContinue();
  };

  const handleRetry = () => {
    if (address.pincode) {
      handlePincodeBlur();
    }
  };

  const handleClearPincodeError = () => {
    dispatch(clearPincodeError());
  };

  const handleSkipPincodeValidation = () => {
    dispatch(clearPincodeError());
  };

  return (
    <div className="address-container">
      <h3>Delivery Address</h3>

      {pincodeValidation.error && (
        <div className="pincode-error-message">
          <Error 
            message={pincodeValidation.error} 
            onRetry={handleRetry}
            className="pincode-error"
          />
          <div className="error-actions">
            <button 
              onClick={handleClearPincodeError}
              className="btn btn-secondary clear-error-btn"
            >
              Dismiss
            </button>
            <button 
              onClick={handleSkipPincodeValidation}
              className="btn btn-primary skip-validation-btn"
            >
              Enter Manually
            </button>
          </div>
        </div>
      )}

      <div className="form-group">
        <select
          value={address.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          className="form-select"
        >
          <option value="Home">Home</option>
          <option value="Work">Work</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Address Line 1 *"
          value={address.addrLine1}
          onChange={(e) => handleInputChange('addrLine1', e.target.value)}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Address Line 2 (Optional)"
          value={address.addrLine2}
          onChange={(e) => handleInputChange('addrLine2', e.target.value)}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Pincode *"
          value={address.pincode}
          onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
          onBlur={handlePincodeBlur}
          className="form-input"
          maxLength={6}
          required
        />
        {pincodeValidation.loading && (
          <Loading size="small" text="Validating pincode..." />
        )}
        {pincodeValidation.error && (
          <p className="pincode-help-text">
            Please enter city and state manually if pincode validation fails.
          </p>
        )}
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="City *"
          value={address.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <select
          value={address.state}
          onChange={(e) => handleInputChange('state', e.target.value)}
          className="form-select"
          required
        >
          <option value="">Select State *</option>
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <button 
        onClick={handleContinue}
        className="btn btn-primary"
        disabled={pincodeValidation.loading}
      >
        Continue to Payment
      </button>
    </div>
  );
};

Address.propTypes = {
  onContinue: PropTypes.func,
};

export default Address;
