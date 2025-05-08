import React from 'react';

const UserDetail = ({ userDetails, setUserDetails, mobile, handleUser }) => {
  return (
    <>
      <h3>User Details</h3>
      <input
        placeholder="Name"
        value={userDetails.name}
        onChange={(e) =>
          setUserDetails({ ...userDetails, name: e.target.value })
        }
      />
      <input placeholder="Mobile Number" value={mobile} disabled />
      <input
        placeholder="Email"
        value={userDetails.email}
        onChange={(e) =>
          setUserDetails({ ...userDetails, email: e.target.value })
        }
      />
      <button onClick={handleUser}>Continue</button>
    </>
  );
};

export default UserDetail;
