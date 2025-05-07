import { useState } from 'react';
import Otp from './Otp';
import axios from 'axios';
export default function Login({ onSuccess }) {
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    const isValid = /^[6-9]\d{9}$/.test(mobile);
    setError('');
    if (!isValid) {
      setError('Enter valid 10-digit mobile number');
      return;
    }

    try {
      // Call backend: /api/otp { contact }
      const res = await axios.post('http://localhost:5000/api/users/otp', {
        contact: mobile,
        countryCode,
      });

      if (res.ok) {
        setOtpSent(true);
        setError('');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="login-container">
      {!otpSent ? (
        <>
          <h2>Enter Mobile Number</h2>
          <div className="phone-input-group">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
            </select>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit number"
              maxLength={10}
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button onClick={handleSendOtp}>Send OTP</button>
        </>
      ) : (
        <Otp
          contact={mobile}
          countryCode={countryCode}
          onVerified={onSuccess}
        />
      )}
    </div>
  );
}
