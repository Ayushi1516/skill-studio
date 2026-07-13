import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../constants';
import { User } from '../../types/interfaces';

interface AuthState {
  currentUser: User | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const storedUser = localStorage.getItem("user");
const initialState: AuthState = {
  currentUser: storedUser ? JSON.parse(storedUser) : null,
  loading: 'idle',
  error: null,
};

// Async thunk for logging in
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: Pick<User, 'email' | 'password'>, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.message || 'Invalid email or password.');
      }

      const userData: User = await res.json();
      return userData;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem('user');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.currentUser));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = 'succeeded';
        state.currentUser = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout, updateUser } = authSlice.actions;

export default authSlice.reducer;