import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { updateUserDetailsLocal, updateUserDetails, resetUserDetails } from '../redux/userSlice';
import { setStep } from '../redux/checkoutSlice';
import Loading from './Loading';
import Error from './Error';

const UserDetail = ({ onContinue }) => {
  const dispatch = useDispatch();
  const { userDetails, loading, error, data: userData } = useSelector((state) => state.user);
  const { currentStep } = useSelector((state) => state.checkout);

  // Debug log to check userDetails
  useEffect(() => {
    console.log('UserDetail - userDetails:', userDetails);
    console.log('UserDetail - userDetails type:', typeof userDetails);
    console.log('UserDetail - userDetails keys:', Object.keys(userDetails || {}));
    
    // Check if userDetails is corrupted (has numeric keys)
    if (userDetails && typeof userDetails === 'object') {
      const hasNumericKeys = Object.keys(userDetails).some(key => !isNaN(parseInt(key)));
      if (hasNumericKeys) {
        console.warn('UserDetail - Detected corrupted userDetails, resetting...');
        dispatch(resetUserDetails());
        
        // Restore valid data from userData if available
        if (userData) {
          const validData = {
            name: userData.name || '',
            email: userData.email || '',
            contact: userData.contact || ''
          };
          dispatch(updateUserDetailsLocal(validData));
        }
      }
    }
  }, [userDetails, dispatch, userData]);

  const handleInputChange = (field, value) => {
    console.log('UserDetail - updating field:', field, 'value:', value);
    
    // Validate the field and value
    if (typeof field !== 'string' || !field) {
      console.error('UserDetail - Invalid field:', field);
      return;
    }
    
    if (typeof value !== 'string') {
      console.error('UserDetail - Invalid value type:', typeof value, value);
      return;
    }
    
    // Only allow valid user detail fields
    const allowedFields = ['name', 'email', 'contact'];
    if (!allowedFields.includes(field)) {
      console.error('UserDetail - Invalid field name:', field);
      return;
    }
    
    // Only update if the value is different
    if (userDetails[field] !== value) {
      dispatch(updateUserDetailsLocal({ [field]: value }));
    }
  };

  const handleContinue = async () => {
    // Validate userDetails before proceeding
    if (!userDetails || typeof userDetails !== 'object') {
      console.error('UserDetail - Invalid userDetails:', userDetails);
      alert('Please fill in all required fields');
      return;
    }
    
    // Check for corrupted data
    const hasNumericKeys = Object.keys(userDetails).some(key => !isNaN(parseInt(key)));
    if (hasNumericKeys) {
      console.error('UserDetail - userDetails is corrupted, cannot proceed');
      alert('Please refresh the page and try again');
      return;
    }
    
    if (!userDetails.name || !userDetails.email) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      console.log('UserDetail - Submitting userDetails:', userDetails);
      await dispatch(updateUserDetails(userDetails)).unwrap();
      dispatch(setStep('address'));
      if (onContinue) onContinue();
    } catch (error) {
      console.error('Failed to update user details:', error);
    }
  };

  const handleRetry = () => {
    handleContinue();
  };

  if (loading) {
    return <Loading text="Updating user details..." />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={handleRetry}
        className="user-detail-error"
      />
    );
  }

  // Ensure userDetails is a proper object and filter out numeric keys
  const safeUserDetails = userDetails && typeof userDetails === 'object' ? 
    Object.fromEntries(
      Object.entries(userDetails).filter(([key]) => isNaN(parseInt(key)))
    ) : {
      name: '',
      email: '',
      contact: ''
    };

  return (
    <div className="user-detail-container">
      <h3>User Details</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="Name *"
          value={safeUserDetails.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="form-input"
          required
        />
      </div>
      
      <div className="form-group">
        <input
          type="tel"
          placeholder="Mobile Number"
          value={safeUserDetails.contact || ''}
          disabled
          className="form-input disabled"
        />
      </div>
      
      <div className="form-group">
        <input
          type="email"
          placeholder="Email *"
          value={safeUserDetails.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="form-input"
          required
        />
      </div>
      
      <button 
        onClick={handleContinue}
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Continue'}
      </button>
    </div>
  );
};

UserDetail.propTypes = {
  onContinue: PropTypes.func,
};

export default UserDetail;
