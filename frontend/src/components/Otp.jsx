import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '../redux/userSlice';

const Otp = ({ contact, countryCode, onVerified }) => {
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();

  const { loading, error, verified } = useSelector((state) => state.user);

  const handleVerify = async () => {
    if (!/^\d{6}$/.test(otp)) {
      return;
    }

    dispatch(verifyOtp({ contact, countryCode, otp }));
  };

  if (verified) {
    onVerified && onVerified();
  }
  return (
    <div className="otp-container">
      <h3>
        Enter the OTP sent to {countryCode} {contact}
      </h3>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 4-digit OTP"
        maxLength={4}
      />
      {error && <p className="error-text">{error}</p>}
      <button onClick={handleVerify} disabled={loading}>
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </div>
  );
};

export default Otp;
