import { useState } from 'react';

export default function Login() {
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const isValid = /^[6-9]\d{9}$/.test(mobile);
    if (!isValid) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    setError('');

    const fullNumber = `${countryCode}${mobile}`;
    console.log('Sending OTP to:', fullNumber);
    // TODO: API call using `fullNumber`
  };

  return (
    <div className="login-container">
      <h2>Login / Sign Up with a phone number to continue</h2>
      <div className="phone-input-group">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        >
          <option value="+91">🇮🇳 +91</option>
          <option value="+1">🇺🇸 +1</option>
          <option value="+44">🇬🇧 +44</option>
          {/* Add more countries if needed */}
        </select>
        <input
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Mobile number"
          maxLength={10}
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <button onClick={handleSubmit}>Send OTP</button>
    </div>
  );
}
