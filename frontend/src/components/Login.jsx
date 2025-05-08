import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveUser } from '../redux/userSlice';
import axios from 'axios';

export default function Login({ onVerified }) {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('mobile');
  const dispatch = useDispatch();

  const handleSendOtp = () => {
    if (/^[6-9]\d{9}$/.test(mobile)) {
      setStep('otp'); // ✅ triggers OTP input
    } else {
      alert('Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9');
    }
    console.log(step, 'step');
  };

  const handleVerifyOtp = async () => {
    if (/^\d{4}$/.test(otp)) {
      dispatch(saveUser({ contact: mobile }));
      await axios.post(
        'http://localhost:5000/api/users',
        { contact: mobile },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      alert('Login successful');
      if (onVerified) onVerified(); // 🔁 inform parent (Checkout)
    } else {
      alert('Invalid OTP. It must be a 4-digit number.');
    }
  };

  return (
    <>
      <h2> Signup/Login with Mobile Number</h2>

      {step === 'mobile' && (
        <>
          <input
            type="text"
            placeholder="Enter mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </>
      )}

      {step === 'otp' && (
        <>
          <p>OTP sent to {mobile} (simulated)</p>
          <input
            type="text"
            placeholder="Enter 4-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}
    </>
  );
}
