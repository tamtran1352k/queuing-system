// authReducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserAction {
  [x: string]: string;
  email: string;
  timestamp: string;
  action: string;
}

interface AuthState {
  user: UserAction | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserAction>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
