import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const otpMap = new Map(); // temp in-memory store
const sendOtp = async (req, res) => {
  const { contact } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    await client.messages.create({
      body: `Your Seva Booking otp is ${otp}`,
      to: contact,
      from: process.env.TWILIO_PHONE,
    });

    otpMap.set(contact, otp);
    res.status(200).json({ msg: 'OTP send successfully' });
  } catch (err) {
    res.status(500).json({ err: 'Failed to send OTP' });
  }
};

const verifyOtp = (req, res) => {
  const { contact, otp } = req.body;
  const storedOtp = otpMap.get(contact);

  if (storedOtp && otp === storedOtp) {
    otpMap.delete(contact);
    res.status(200).json({ verified: true });
  } else {
    res.status(400).json({ err: 'Invalid OTP' });
  }
};

export { sendOtp, verifyOtp };
