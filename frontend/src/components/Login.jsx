import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { loginUser, clearError } from '../redux/userSlice';
import { setStep } from '../redux/checkoutSlice';
import Loading from './Loading';
import Error from './Error';

const Login = ({ onVerified }) => {
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.user);
  
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStepState] = useState('mobile');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isAuthenticated && onVerified) {
      console.log('Login - User authenticated, calling onVerified');
      onVerified();
    }
  }, [isAuthenticated, onVerified]);

  const validateMobile = (mobileNumber) => {
    return /^[6-9]\d{9}$/.test(mobileNumber);
  };

  const validateOtp = (otpValue) => {
    return /^\d{4}$/.test(otpValue);
  };

  const handleSendOtp = () => {
    setValidationError('');
    if (validateMobile(mobile)) {
      console.log('Login - Sending OTP for mobile:', mobile);
      setStepState('otp');
    } else {
      setValidationError('Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9');
    }
  };

  const handleVerifyOtp = async () => {
    setValidationError('');
    if (!validateOtp(otp)) {
      setValidationError('Invalid OTP. It must be a 4-digit number.');
      return;
    }

    try {
      console.log('Login - Verifying OTP for mobile:', mobile);
      const result = await dispatch(loginUser({ mobile, otp })).unwrap();
      console.log('Login - Login successful, result:', result);
      dispatch(setStep('user'));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRetry = () => {
    dispatch(clearError());
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(value);
    setValidationError('');
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setOtp(value);
    setValidationError('');
  };

  if (loading) {
    return <Loading text="Processing..." />;
  }

  return (
    <div className="checkout-login">
      <h2>Signup/Login with Mobile Number</h2>

      {error && (
        <Error 
          message={error} 
          onRetry={handleRetry}
          className="login-error"
        />
      )}

      {validationError && (
        <div className="validation-error">
          <p>{validationError}</p>
        </div>
      )}

      {step === 'mobile' ? (
        <div className="login-step">
          <div className="form-group">
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={handleMobileChange}
              className="form-input"
              maxLength={10}
            />
          </div>
          <button 
            onClick={handleSendOtp}
            className="btn btn-primary"
            disabled={loading}
          >
            Send OTP
          </button>
        </div>
      ) : (
        <div className="login-step">
          <p className="otp-info">OTP sent to {mobile} (simulated)</p>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={handleOtpChange}
              className="form-input"
              maxLength={4}
            />
          </div>
          <button 
            onClick={handleVerifyOtp}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button 
            onClick={() => setStepState('mobile')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Back to Mobile
          </button>
        </div>
      )}
    </div>
  );
};

Login.propTypes = {
  onVerified: PropTypes.func,
};

export default Login;
