import React, { useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSevas, incrementPage, resetSevas, clearError } from '../redux/sevaSlice';
import Loading from '../components/Loading';
import Error from '../components/Error';

const Sevacard = React.lazy(() => import('../components/Sevacard'));

const Home = () => {
  const dispatch = useDispatch();
  const { sevas, loading, error, page, hasMore } = useSelector((state) => state.seva);

  useEffect(() => {
    if (sevas.length === 0) {
      dispatch(fetchSevas({ page: 1, limit: 5 }));
    }
  }, [dispatch, sevas.length]);

  // Fetch more sevas when page changes (for pagination)
  useEffect(() => {
    if (page > 1 && sevas.length > 0) {
      console.log('Home - Fetching more sevas for page:', page);
      dispatch(fetchSevas({ page, limit: 5 }));
    }
  }, [page, dispatch]);

  const handleViewMore = () => {
    if (!loading && hasMore) {
      dispatch(incrementPage());
    }
  };

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchSevas({ page: 1, limit: 5 }));
  };

  if (loading && page === 1) {
    return <Loading text="Loading sevas..." />;
  }

  if (error && page === 1) {
    return (
      <Error 
        message={error} 
        onRetry={handleRetry}
        className="home-error"
      />
    );
  }

  return (
    <div className="home-container">
      <h1 className="home-title">Available Sevas</h1>

      {sevas.length === 0 && !loading ? (
        <div className="no-sevas">
          <p>No sevas available at the moment.</p>
        </div>
      ) : (
        <>
          <div className="seva-grid">
            <Suspense fallback={<Loading text="Loading cards..." />}>
              {sevas.map((seva, index) => (
                <Sevacard key={`${seva.code}-${index}`} seva={seva} />
              ))}
            </Suspense>
          </div>

          {hasMore && (
            <div className="view-more-container">
              <button 
                onClick={handleViewMore} 
                className="view-more-btn"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'View More'}
              </button>
            </div>
          )}

          {loading && page > 1 && (
            <div className="loading-more">
              <Loading text="Loading more sevas..." />
            </div>
          )}

          {error && page > 1 && (
            <div className="error-more">
              <Error 
                message={error} 
                onRetry={handleRetry}
                className="load-more-error"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
