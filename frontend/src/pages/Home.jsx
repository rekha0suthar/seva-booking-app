import React, { useEffect, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSevas, incrementPage } from '../redux/sevaSlice';

const Sevacard = lazy(() => import('../components/Sevacard'));

const Home = () => {
  const dispatch = useDispatch();
  const { sevas, loading, page, hasMore } = useSelector((state) => state.seva);

  useEffect(() => {
    dispatch(fetchSevas({ page, limit: 5 }));
  }, [page, dispatch]);

  const handleViewMore = () => {
    dispatch(incrementPage());
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Available Sevas</h1>

      {loading && page === 1 ? (
        <p>Loading initial data...</p>
      ) : (
        <>
          <div className="seva-grid">
            <Suspense fallback={<p>Loading cards...</p>}>
              {sevas.map((seva, index) => (
                <Sevacard key={`${seva.code}-${index}`} seva={seva} />
              ))}
            </Suspense>
          </div>

          {hasMore && (
            <div className="view-more-cont">
              <button onClick={handleViewMore} className="view-more-btn">
                View More
              </button>
            </div>
          )}

          {loading && page > 1 && <p className="loading">Loading more...</p>}
        </>
      )}
    </div>
  );
};

export default Home;
