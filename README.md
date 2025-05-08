# Seva Booking Application 🙏

A full-featured MERN stack application to browse, book, and manage temple sevas. Users can log in with their mobile number, select sevas, provide address details, and complete bookings through a simple checkout flow.

---

## 🛠️ Tech Stack

- **Frontend**: React.js + Redux Toolkit + React Router
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: Mobile number with simulated OTP
- **Styling**: CSS3 (modular & responsive) with custom design tokens
- **Payment (Mocked)**: Card / UPI fields with validation

---

## 📦 Features

- 🔓 Login with mobile number & OTP (4-digit simulated)
- 🎉 Browse and view sevas as styled cards
- ➕ Add/remove sevas to cart
- 📦 Two-column responsive checkout layout
- 🏠 Address autofill via saved pincode data
- 💳 Payment options with validation
- 📜 Order summary with latest 3 orders per user
- 📱 Responsive design with mobile nav toggle
- ♻️ Redux-based cart and user state management
- ⚡ Optimized with code-splitting and lazy loading

---

## 🚀 Getting Started

### 1. Clone the repo

```
git clone https://github.com/your-username/seva-booking-app.git
cd seva-booking-app

```

### 2. Install dependencies

Backend:

```

cd backend
npm install
```

Frontend:

```

cd frontend
npm install
```

### 3. Set up environment variables

📁 backend/.env

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/seva-app
```

### 4. Run the app

Run backend:

```
cd backend
npm start
```

Run frontend (Vite):

```cd frontend
npm run dev
```

Frontend will run on http://localhost:5173
Backend will run on http://localhost:5000/api

📁 Folder Structure

```
/backend
/models
/routes
/controllers
server.js

/frontend
/src
/pages
/components
/redux
/utils
main.jsx
App.jsx
```

#### 🧪 Future Enhancements

1. Firebase OTP authentication

2. Real payment integration (Razorpay/Stripe)

3. Admin panel for managing sevas

4. Pincode data API integration

5. Address reuse & profile page
