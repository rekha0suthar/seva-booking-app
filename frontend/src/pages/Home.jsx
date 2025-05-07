import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSevas } from '../redux/sevaSlice';
import Sevacard from '../components/Sevacard';

const Home = () => {
  const dispatch = useDispatch();
  const { sevas, loading } = useSelector((state) => state.seva);

  useEffect(() => {
    dispatch(fetchSevas());
  }, [dispatch]);

  if (loading) return <p>loading...</p>;
  return (
    <div className="home-container">
      <h1 className="home-title">Available Sevas</h1>
      <div className="seva-grid">
        {sevas.map((seva) => (
          <Sevacard key={seva.code} seva={seva} />
        ))}
      </div>
    </div>
  );
};

export default Home;
