# Seva Booking App

A modern, responsive web application for booking religious services (sevas) with a comprehensive Redux-based state management system.

## 🚀 Features

- **User Authentication**: Mobile OTP-based login/signup
- **Seva Browsing**: Browse and search available religious services
- **Shopping Cart**: Add/remove items with real-time total calculation
- **Checkout Flow**: Multi-step checkout process (Login → User Details → Address → Payment)
- **Address Management**: Pincode validation with auto-fill city/state
- **Payment Processing**: Support for card and UPI payments
- **Order Management**: Track order history and status
- **Responsive Design**: Mobile-first responsive UI

## 🏗️ Architecture

### Frontend Stack
- **React 18** with modern hooks and functional components
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API communication
- **CSS3** with modern styling and animations

### State Management
The app uses Redux Toolkit with the following slices:

#### 1. **User Slice** (`userSlice.js`)
- User authentication state
- User profile management
- Login/logout functionality
- Async thunks for API calls

#### 2. **Seva Slice** (`sevaSlice.js`)
- Seva data management
- Pagination support
- Loading and error states
- Infinite scroll functionality

#### 3. **Cart Slice** (`cartSlice.js`)
- Shopping cart management
- Add/remove items
- Total calculation
- Cart persistence

#### 4. **Checkout Slice** (`checkoutSlice.js`)
- Multi-step checkout flow
- Address and payment form management
- Form validation
- Order placement

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Loading.jsx          # Reusable loading component
│   │   ├── Error.jsx            # Reusable error component
│   │   ├── Login.jsx            # Authentication component
│   │   ├── UserDetail.jsx       # User details form
│   │   ├── Address.jsx          # Address form with validation
│   │   ├── Payment.jsx          # Payment form
│   │   ├── Sevacard.jsx         # Individual seva card
│   │   └── Navbar.jsx           # Navigation component
│   ├── pages/
│   │   ├── Home.jsx             # Main seva listing page
│   │   └── Checkout.jsx         # Checkout flow page
│   ├── redux/
│   │   ├── store.js             # Redux store configuration
│   │   ├── userSlice.js         # User state management
│   │   ├── sevaSlice.js         # Seva state management
│   │   ├── cartSlice.js         # Cart state management
│   │   └── checkoutSlice.js     # Checkout state management
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # App entry point
```

## 🎯 Best Practices Implemented

### 1. **Redux Best Practices**
- ✅ Proper slice structure with reducers and async thunks
- ✅ Normalized state shape
- ✅ Immutable updates using Immer
- ✅ Proper error handling and loading states
- ✅ Selector optimization

### 2. **React Best Practices**
- ✅ Functional components with hooks
- ✅ Proper prop validation with PropTypes
- ✅ Component composition and reusability
- ✅ Lazy loading for better performance
- ✅ Proper error boundaries

### 3. **Code Quality**
- ✅ Consistent code formatting
- ✅ Meaningful variable and function names
- ✅ Proper error handling
- ✅ Loading states for better UX
- ✅ Form validation

### 4. **User Experience**
- ✅ Responsive design
- ✅ Loading indicators
- ✅ Error messages with retry options
- ✅ Form validation with real-time feedback
- ✅ Smooth transitions and animations

## 🔧 Key Components

### Loading Component
Reusable loading spinner with different sizes and customizable text.

```jsx
<Loading size="medium" text="Loading sevas..." />
```

### Error Component
Consistent error display with retry functionality.

```jsx
<Error message="Failed to load data" onRetry={handleRetry} />
```

### Form Components
Standardized form inputs with validation and error handling.

```jsx
<div className="form-group">
  <input
    type="text"
    placeholder="Name *"
    className="form-input"
    required
  />
</div>
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd seva-booking-app
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Features in Detail

### Authentication Flow
1. User enters mobile number
2. OTP is sent (simulated)
3. User verifies OTP
4. User is authenticated and redirected

### Checkout Flow
1. **Login**: Mobile OTP authentication
2. **User Details**: Name, email, and contact information
3. **Address**: Delivery address with pincode validation
4. **Payment**: Card or UPI payment options
5. **Order Confirmation**: Order placed successfully

### Cart Management
- Add items from seva listing
- Remove items from cart
- Real-time total calculation
- Cart persistence across sessions

### Address Validation
- Pincode-based city/state auto-fill
- Real-time validation
- Error handling for invalid pincodes

## 🎨 Styling

The app uses modern CSS with:
- Flexbox and Grid layouts
- CSS custom properties
- Smooth transitions and animations
- Mobile-first responsive design
- Consistent color scheme and typography

## 🔒 Security Features

- Input validation and sanitization
- Secure API communication
- Protected routes
- Session management

## 📊 Performance Optimizations

- Lazy loading of components
- Redux state normalization
- Optimized re-renders
- Efficient API calls with caching

## 🧪 Testing

The app is structured to support testing:
- Component isolation
- Redux state testing
- API mocking capabilities
- Error scenario handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Note**: This is a frontend-only implementation. The backend API endpoints are expected to be available at the configured base URL.
