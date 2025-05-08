const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
];

const Address = ({
  address,
  setAddress,
  pinError,
  handlePincodeCheck,
  setStep,
}) => {
  return (
    <>
      <h3>Address</h3>
      <select
        value={address.type}
        onChange={(e) => setAddress({ ...address, type: e.target.value })}
      >
        <option value="Home">Home</option>
        <option value="Work">Work</option>
        <option value="Other">Other</option>
      </select>
      <input
        placeholder="Address Line 1"
        value={address.addrLine1}
        onChange={(e) => setAddress({ ...address, addrLine1: e.target.value })}
      />
      <input
        placeholder="Address Line 2"
        value={address.addrLine2}
        onChange={(e) => setAddress({ ...address, addrLine2: e.target.value })}
      />
      <input
        placeholder="Pincode"
        value={address.pincode}
        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
        onBlur={handlePincodeCheck}
      />
      {pinError && <p className="error">{pinError}</p>}
      <input
        placeholder="City"
        value={address.city}
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
      />
      <select
        value={address.state}
        onChange={(e) => setAddress({ ...address, state: e.target.value })}
      >
        <option value="">Select State</option>
        {INDIAN_STATES.map((st) => (
          <option key={st} value={st}>
            {st}
          </option>
        ))}
      </select>
      <button onClick={() => setStep('payment')}>Continue to Payment</button>
    </>
  );
};

export default Address;
