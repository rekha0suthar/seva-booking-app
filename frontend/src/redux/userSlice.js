import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const loginUser = createAsyncThunk(
  'user/login',
  async ({ mobile, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/users', { contact: mobile });

      // Ensure we have a proper userId to store
      let userId = response.data?._id;
      if (!userId && response.data) {
        // If no _id in response, try to use the response data as userId
        userId = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      }

      if (userId) {
        localStorage.setItem('userId', userId);
        console.log('Login - Stored userId:', userId);
      } else {
        console.warn('Login - No userId found in response:', response.data);
      }

      // Ensure the mobile number is included in the response
      return {
        ...response.data,
        contact: mobile,
        _id: userId
      };
    } catch (error) {
      console.error('Login - API error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { rejectWithValue, getState }) => {
    try {
      console.log('Fetching profile for userId:', userId);
      const response = await axios.get(`/users/${userId}`);
      console.log('Profile API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      // If API fails, create a fallback profile from existing user data
      const state = getState();
      const userData = state.user.data;
      const userDetails = state.user.userDetails;

      if (userData || userDetails.contact) {
        // Create a fallback profile from available data
        const fallbackProfile = {
          _id: userId,
          name: userDetails.name || userData?.name || 'User',
          email: userDetails.email || userData?.email || 'No email',
          contact: userDetails.contact || userData?.contact || 'No contact',
        };
        console.log('Using fallback profile:', fallbackProfile);
        return fallbackProfile;
      }

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  'user/updateDetails',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/users', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    userDetails: {
      name: '',
      email: '',
      contact: '',
    },
    profile: null,
  },
  reducers: {
    saveUser: (state, action) => {
      state.data = action.payload;
      state.isAuthenticated = true;
      state.userDetails.contact = action.payload.contact;
    },
    logout: (state) => {
      state.data = null;
      state.isAuthenticated = false;
      state.userDetails = {
        name: '',
        email: '',
        contact: '',
      };
      state.profile = null;
      localStorage.removeItem('userId');
    },
    updateUserDetailsLocal: (state, action) => {
      // Ensure we're updating the correct structure and prevent corruption
      const updates = action.payload;
      if (typeof updates === 'object' && updates !== null) {
        // Only allow specific user detail fields to be updated
        const allowedFields = ['name', 'email', 'contact'];
        const validUpdates = {};

        for (const [key, value] of Object.entries(updates)) {
          if (allowedFields.includes(key) && typeof value === 'string') {
            validUpdates[key] = value;
          }
        }

        if (Object.keys(validUpdates).length > 0) {
          state.userDetails = { ...state.userDetails, ...validUpdates };
          console.log('UserDetails updated with:', validUpdates);
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    resetUserDetails: (state) => {
      // Reset userDetails to clean state
      state.userDetails = {
        name: '',
        email: '',
        contact: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isAuthenticated = true;
        // Ensure the mobile number is set in userDetails
        state.userDetails.contact = action.payload.contact || action.payload.mobile;
        console.log('Login fulfilled - userDetails:', state.userDetails);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        // If profile has contact info, update userDetails (but don't overwrite existing data)
        if (action.payload.contact && !state.userDetails.contact) {
          state.userDetails.contact = action.payload.contact;
        }
        console.log('Profile fetched successfully:', action.payload);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Profile fetch rejected:', action.payload);
      })
      // Update Details
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        // Only update userDetails with valid user data, not API response
        if (action.payload && typeof action.payload === 'object') {
          const allowedFields = ['name', 'email', 'contact'];
          const validUpdates = {};

          for (const [key, value] of Object.entries(action.payload)) {
            if (allowedFields.includes(key) && typeof value === 'string') {
              validUpdates[key] = value;
            }
          }

          if (Object.keys(validUpdates).length > 0) {
            state.userDetails = { ...state.userDetails, ...validUpdates };
          }
        }
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  saveUser,
  logout,
  updateUserDetailsLocal,
  clearError,
  setLoading,
  resetUserDetails
} = userSlice.actions;

export default userSlice.reducer;
