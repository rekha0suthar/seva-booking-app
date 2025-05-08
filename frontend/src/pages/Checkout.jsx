import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem } from '../redux/cartSlice';
import { fetchSevas } from '../redux/sevaSlice';
import axios from 'axios';

const Login = lazy(() => import('../components/Login'));
const UserDetail = lazy(() => import('../components/UserDetail'));
const Address = lazy(() => import('../components/Address'));
const Payment = lazy(() => import('../components/Payment'));

const Checkout = () => {
  const { sevas } = useSelector((state) => state.seva || []);
  const cart = useSelector((state) => state.cart.items || []);
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
      const res = await axios.post('/users', {
        contact: userDetails.number,
        name: userDetails.name,
        email: userDetails.email,
      });
      localStorage.setItem('userId', res.data);
      setStep('address');
    } catch (err) {
      console.error('User creation failed', err);
    }
  };

  const handlePincodeCheck = async () => {
    try {
      const res = await axios.get(`/address-by-pincode/${address.pincode}`);
      if (res.data.city && res.data.state) {
        setAddress((prev) => ({
          ...prev,
          city: res.data.city,
          state: res.data.state,
        }));
        setPinError('');
      } else {
        setPinError('Invalid pincode');
      }
    } catch (err) {
      setPinError('Failed to fetch pincode data');
    }
  };

  const fetchSeva = async (code) => {
    try {
      const res = await axios.get(`/sevas/${code}`);
      const sevaData = res.data;
      if (!cart.find((item) => item.code === sevaData.code)) {
        dispatch(addItem(sevaData));
      }
    } catch (err) {
      console.error('Error fetching seva:', err);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setStep('user');
    }
    if (user?.contact) {
      setUserDetails((prev) => ({ ...prev, number: user.contact }));
      setMobile(user.contact);
    }

    const code = localStorage.getItem('sevaCode');
    if (code) fetchSeva(code);

    dispatch(fetchSevas());
  }, [user, dispatch]);

  return (
    <div className="checkout-container two-column">
      {step === 'login' ? (
        <Suspense fallback={<p>Loading login...</p>}>
          <Login onVerified={() => setStep('user')} />
        </Suspense>
      ) : (
        <>
          <div className="checkout-left">
            <h2>Available Sevas</h2>
            <div className="seva-scroll">
              {sevas.map((seva) => (
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
              <Suspense fallback={<p>Loading user details...</p>}>
                <UserDetail
                  userDetails={userDetails}
                  setUserDetails={setUserDetails}
                  mobile={mobile}
                  handleUser={handleUser}
                />
              </Suspense>
            )}

            {step === 'address' && (
              <Suspense fallback={<p>Loading address form...</p>}>
                <Address
                  address={address}
                  setAddress={setAddress}
                  pinError={pinError}
                  handlePincodeCheck={handlePincodeCheck}
                  setStep={setStep}
                />
              </Suspense>
            )}

            {step === 'payment' && (
              <Suspense fallback={<p>Loading payment...</p>}>
                <Payment userDetails={userDetails} address={address} />
              </Suspense>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
