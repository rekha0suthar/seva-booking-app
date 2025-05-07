import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSevas, incrementPage } from '../redux/sevaSlice';
import Sevacard from '../components/Sevacard';

const Home = () => {
  const dispatch = useDispatch();
  const { sevas, loading, page, hasMore } = useSelector((state) => state.seva);

  useEffect(() => {
    dispatch(fetchSevas({ page, limit: 5 }));
  }, [page, dispatch]);

  const handleViewMore = () => {
    dispatch(incrementPage());
  };

  if (loading) return <p>loading...</p>;
  return (
    <div className="home-container">
      <h1 className="home-title">Available Sevas</h1>
      <div className="seva-grid">
        {sevas.map((seva, index) => (
          <Sevacard key={`${seva.code}-${index}`} seva={seva} />
        ))}
      </div>
      {hasMore && !loading && (
        <div className="view-more-cont">
          <button onClick={handleViewMore} className="view-more-btn">
            View More
          </button>
        </div>
      )}
      {loading && <p className="loading">Loading...</p>}
    </div>
  );
};

export default Home;
