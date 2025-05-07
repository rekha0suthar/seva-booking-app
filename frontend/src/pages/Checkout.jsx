import { useEffect, useState } from 'react';
import Login from '../components/Login';
import { useSelector } from 'react-redux';

export default function Checkout() {
  const user = useSelector((state) => state.user.data);
  const verified = useSelector((state) => state.user.verified);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (user && verified) {
      setLoggedIn(true);
    }
  }, [user, verified]);

  return (
    <div className="checkout-container">
      {!loggedIn ? (
        <Login onSuccess={() => setLoggedIn(true)} />
      ) : (
        <>
          <h2>Checkout</h2>
          {/* TODO: Items, address, and payment form */}
        </>
      )}
    </div>
  );
}
