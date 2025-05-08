import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveUser } from '../redux/userSlice';
import axios from 'axios';

export default function Login({ onVerified }) {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('mobile');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSendOtp = () => {
    setError('');
    if (/^[6-9]\d{9}$/.test(mobile)) {
      setStep('otp'); // triggers OTP input
    } else {
      setError(
        'Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9'
      );
    }
  };

  const handleVerifyOtp = async () => {
    // setError('');
    if (!/^\d{4}$/.test(otp)) {
      setError('Invalid OTP. It must be a 4-digit number.');
      return;
    }

    try {
      dispatch(saveUser({ contact: mobile }));

      const res = await axios.post(
        'http://localhost:5000/api/users',
        { contact: mobile },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Store user ID if returned
      if (res.data?._id) {
        localStorage.setItem('userId', res.data._id);
      }

      alert('Login successful');
      if (onVerified) onVerified();
    } catch (err) {
      console.error('Login failed:', err.message);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="checkout-login">
      <h2>Signup/Login with Mobile Number</h2>

      {step === 'mobile' ? (
        <>
          <input
            type="text"
            placeholder="Enter mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            maxLength={10}
          />
          <p className="error">{error}</p>
          <button onClick={handleSendOtp}>Send OTP</button>
        </>
      ) : (
        <>
          <p>OTP sent to {mobile} (simulated)</p>
          <input
            type="text"
            placeholder="Enter 4-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={4}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}
    </div>
  );
}
