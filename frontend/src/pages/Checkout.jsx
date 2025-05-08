// src/pages/Checkout.jsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem } from '../redux/cartSlice';
import axios from 'axios';
import Login from '../components/Login';
import UserDetail from '../components/UserDetail';
import Address from '../components/Address';
import Payment from '../components/Payment';
import { fetchSevas } from '../redux/sevaSlice';

export default function Checkout() {
  const { sevas } = useSelector((state) => state.seva || []);
  const cart = useSelector((state) => state.cart?.items || []);
  const user = useSelector((state) => state.user.data);

  const dispatch = useDispatch();

  const [step, setStep] = useState('login');
  const [mobile, setMobile] = useState('');
  const [userDetails, setUserDetails] = useState({
    name: '',
    number: '',
    email: '',
  });
  const [address, setAddress] = useState({
    type: 'Home',
    addrLine1: '',
    addrLine2: '',
    pincode: '',
    city: '',
    state: '',
  });
  const [pinError, setPinError] = useState('');

  const total = cart.reduce((sum, item) => sum + item.discountedPrice, 0);

  const handleUser = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/users',
        {
          contact: userDetails.number,
          name: userDetails.name,
          email: userDetails.email,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      setStep('address');
    } catch (err) {
      console.error(err);
    }
  };

  const handlePincodeCheck = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/address-by-pincode/${address.pincode}`
      );
      const data = await res.json();
      if (res.ok) {
        setAddress((prev) => ({ ...prev, city: data.city, state: data.state }));
        setPinError('');
      } else {
        setPinError(data.error || 'Invalid pincode');
      }
    } catch (err) {
      setPinError('Error fetching pincode info');
    }
  };

  const fetchSeva = async (code) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/sevas/${code}`);
      const sevaData = res.data;

      // Add to cart if not already present
      const alreadyInCart = cart.some((item) => item.code === sevaData.code);
      if (!alreadyInCart) {
        dispatch(addItem(sevaData));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && user.contact) {
      setUserDetails((prev) => ({ ...prev, number: user.contact }));
      setMobile(user.contact);
    }

    const code = localStorage.getItem('sevaCode');
    if (code) {
      fetchSeva(code);
    }

    dispatch(fetchSevas());
  }, [user, dispatch]);

  return (
    <div className="checkout-container two-column">
      {step === 'login' && (
        <div className="checkout-login">
          <Login onVerified={() => setStep('user')} />
        </div>
      )}

      {step !== 'login' && (
        <>
          <div className="checkout-left">
            <h2>Available Sevas</h2>
            <div className="seva-scroll">
              {sevas?.map((seva) => (
                <div key={seva.code} className="cart-item">
                  <p>
                    {seva.title} - ₹{seva.discountedPrice}
                  </p>
                  <button onClick={() => dispatch(addItem(seva))}>Add</button>
                </div>
              ))}
            </div>

            <h3>Selected Sevas</h3>

            {cart.map((item) => (
              <div key={item.code} className="cart-item">
                <p>
                  {item.title} - ₹{item.discountedPrice}
                </p>
                <button onClick={() => dispatch(removeItem(item.code))}>
                  Remove
                </button>
              </div>
            ))}

            <h4>Total: ₹{total}</h4>
          </div>

          <div className="checkout-right">
            {step === 'user' && (
              <UserDetail
                userDetails={userDetails}
                setUserDetails={setUserDetails}
                mobile={mobile}
                handleUser={handleUser}
              />
            )}

            {step === 'address' && (
              <Address
                address={address}
                setAddress={setAddress}
                pinError={pinError}
                handlePincodeCheck={handlePincodeCheck}
                setStep={setStep}
              />
            )}

            {step === 'payment' && (
              <Payment userDetails={userDetails} address={address} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
