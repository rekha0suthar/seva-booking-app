import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const validatePincode = createAsyncThunk(
    'checkout/validatePincode',
    async (pincode, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/address-by-pincode/${pincode}`);
            // Check if the response has valid city and state data
            if (response.data && response.data.city && response.data.state) {
                return response.data;
            } else {
                // If no valid data, return a specific error
                return rejectWithValue('No address found for this pincode. Please enter manually.');
            }
        } catch (error) {
            // Handle different types of errors gracefully
            if (error.response?.status === 404) {
                return rejectWithValue('No address found for this pincode. Please enter manually.');
            } else if (error.response?.status >= 500) {
                return rejectWithValue('Server error. Please enter address manually.');
            } else {
                return rejectWithValue('Unable to validate pincode. Please enter address manually.');
            }
        }
    }
);

export const saveAddress = createAsyncThunk(
    'checkout/saveAddress',
    async (addressData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/address', addressData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const placeOrder = createAsyncThunk(
    'checkout/placeOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/orders', orderData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: {
        currentStep: 'login', // login, user, address, payment
        address: {
            type: 'Home',
            addrLine1: '',
            addrLine2: '',
            pincode: '',
            city: '',
            state: '',
        },
        payment: {
            method: 'card',
            card: {
                cardNumber: '',
                expiry: '',
                cvv: '',
            },
            upiId: '',
        },
        pincodeValidation: {
            loading: false,
            error: null,
            data: null,
        },
        order: {
            loading: false,
            error: null,
            data: null,
        },
        addressValidation: {
            loading: false,
            error: null,
        },
    },
    reducers: {
        setStep: (state, action) => {
            state.currentStep = action.payload;
        },
        updateAddress: (state, action) => {
            state.address = { ...state.address, ...action.payload };
        },
        updatePayment: (state, action) => {
            state.payment = { ...state.payment, ...action.payload };
        },
        updatePaymentMethod: (state, action) => {
            state.payment.method = action.payload;
        },
        updateCardDetails: (state, action) => {
            state.payment.card = { ...state.payment.card, ...action.payload };
        },
        updateUpiId: (state, action) => {
            state.payment.upiId = action.payload;
        },
        clearPincodeError: (state) => {
            state.pincodeValidation.error = null;
        },
        clearOrderError: (state) => {
            state.order.error = null;
        },
        resetCheckout: (state) => {
            state.currentStep = 'login';
            state.address = {
                type: 'Home',
                addrLine1: '',
                addrLine2: '',
                pincode: '',
                city: '',
                state: '',
            };
            state.payment = {
                method: 'card',
                card: {
                    cardNumber: '',
                    expiry: '',
                    cvv: '',
                },
                upiId: '',
            };
            state.pincodeValidation = {
                loading: false,
                error: null,
                data: null,
            };
            state.order = {
                loading: false,
                error: null,
                data: null,
            };
            state.addressValidation = {
                loading: false,
                error: null,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            // Pincode validation
            .addCase(validatePincode.pending, (state) => {
                state.pincodeValidation.loading = true;
                state.pincodeValidation.error = null;
            })
            .addCase(validatePincode.fulfilled, (state, action) => {
                state.pincodeValidation.loading = false;
                state.pincodeValidation.data = action.payload;
                state.pincodeValidation.error = null;

                // Only update city and state if they are provided and different from current values
                if (action.payload.city && action.payload.state) {
                    // Use spread operator to ensure immutable update
                    state.address = {
                        ...state.address,
                        city: action.payload.city,
                        state: action.payload.state
                    };
                }
            })
            .addCase(validatePincode.rejected, (state, action) => {
                state.pincodeValidation.loading = false;
                state.pincodeValidation.error = action.payload;
                // Don't clear the pincode - let user keep it and enter manually
            })
            // Save address
            .addCase(saveAddress.pending, (state) => {
                state.addressValidation.loading = true;
                state.addressValidation.error = null;
            })
            .addCase(saveAddress.fulfilled, (state) => {
                state.addressValidation.loading = false;
            })
            .addCase(saveAddress.rejected, (state, action) => {
                state.addressValidation.loading = false;
                state.addressValidation.error = action.payload;
            })
            // Place order
            .addCase(placeOrder.pending, (state) => {
                state.order.loading = true;
                state.order.error = null;
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.order.loading = false;
                state.order.data = action.payload;
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.order.loading = false;
                state.order.error = action.payload;
            });
    },
});

export const {
    setStep,
    updateAddress,
    updatePayment,
    updatePaymentMethod,
    updateCardDetails,
    updateUpiId,
    clearPincodeError,
    clearOrderError,
    resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer; 