import { useEffect, useState } from 'react';
import Login from '../components/login';

const Checkout = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (localUser) {
      setUser(localUser);
    }
  }, []);
  return (
    <div className="checkout-cont">
      {!user ? (
        <>
          <a href="/">Back</a>
          <Login />
        </>
      ) : (
        <div>checkout</div>
      )}
    </div>
  );
};

export default Checkout;
