import React, { useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem } from '../redux/cartSlice';
import { fetchSevas } from '../redux/sevaSlice';
import { setStep } from '../redux/checkoutSlice';
import Loading from '../components/Loading';
import Error from '../components/Error';

const Login = React.lazy(() => import('../components/Login'));
const UserDetail = React.lazy(() => import('../components/UserDetail'));
const Address = React.lazy(() => import('../components/Address'));
const Payment = React.lazy(() => import('../components/Payment'));

const Checkout = () => {
  const dispatch = useDispatch();
  
  const { sevas, loading: sevasLoading, error: sevasError } = useSelector((state) => state.seva);
  const { items, total } = useSelector((state) => state.cart);
  const { currentStep } = useSelector((state) => state.checkout);
  const { isAuthenticated } = useSelector((state) => state.user);

  // Fetch sevas only once when component mounts
  useEffect(() => {
    if (sevas.length === 0) {
      dispatch(fetchSevas({ page: 1, limit: 10 }));
    }
  }, [dispatch, sevas.length]);

  // Handle authentication state changes separately
  useEffect(() => {
    if (isAuthenticated && currentStep === 'login') {
      dispatch(setStep('user'));
    }
  }, [dispatch, isAuthenticated, currentStep]);

  const handleAddToCart = (seva) => {
    dispatch(addItem(seva));
  };

  const handleRemoveFromCart = (code) => {
    dispatch(removeItem(code));
  };

  const handleRetry = () => {
    dispatch(fetchSevas({ page: 1, limit: 10 }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'login':
        return (
          <Suspense fallback={<Loading text="Loading login..." />}>
            <Login onVerified={() => dispatch(setStep('user'))} />
          </Suspense>
        );
      case 'user':
        return (
          <Suspense fallback={<Loading text="Loading user details..." />}>
            <UserDetail onContinue={() => dispatch(setStep('address'))} />
          </Suspense>
        );
      case 'address':
        return (
          <Suspense fallback={<Loading text="Loading address form..." />}>
            <Address onContinue={() => dispatch(setStep('payment'))} />
          </Suspense>
        );
      case 'payment':
        return (
          <Suspense fallback={<Loading text="Loading payment..." />}>
            <Payment onSuccess={() => dispatch(setStep('login'))} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<Loading text="Loading login..." />}>
            <Login onVerified={() => dispatch(setStep('user'))} />
          </Suspense>
        );
    }
  };

  if (sevasLoading && sevas.length === 0) {
    return <Loading text="Loading sevas..." />;
  }

  if (sevasError && sevas.length === 0) {
    return (
      <Error 
        message={sevasError} 
        onRetry={handleRetry}
        className="checkout-error"
      />
    );
  }

  return (
    <div className="checkout-container two-column">
      {currentStep === 'login' ? (
        <div className="checkout-full-width">
          {renderStep()}
        </div>
      ) : (
        <>
          <div className="checkout-left">
            <h2>Available Sevas</h2>
            
            {sevasLoading ? (
              <Loading text="Loading sevas..." />
            ) : (
              <div className="seva-scroll">
                {sevas.map((seva) => (
                  <div key={seva.code} className="cart-item">
                    <div className="item-info">
                      <p className="item-title">{seva.title}</p>
                      <p className="item-price">₹{seva.discountedPrice}</p>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(seva)}
                      className="add-btn"
                      disabled={items.some(item => item.code === seva.code)}
                    >
                      {items.some(item => item.code === seva.code) ? 'Added' : 'Add'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <h3>Selected Sevas</h3>
            {items.length === 0 ? (
              <p className="no-items">No items selected</p>
            ) : (
              <>
                {items.map((item) => (
                  <div key={item.code} className="cart-item selected">
                    <div className="item-info">
                      <p className="item-title">{item.title}</p>
                      <p className="item-price">₹{item.discountedPrice}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(item.code)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="cart-total">
                  <h4>Total: ₹{total}</h4>
                </div>
              </>
            )}
          </div>

          <div className="checkout-right">
            {renderStep()}
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
