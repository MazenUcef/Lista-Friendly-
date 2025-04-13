import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

interface User {
    id: string;
    fullName?: string;
    email?: string;
    profilePicture?: string;
    // Add other user properties as needed
}

interface AuthState {
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    isAuthenticated: boolean;
}

export interface GoogleAuthData {
    email: string;
    name: string;
    googlePhotoUrl?: string;
    firebaseUid?: string;
}

export interface UserCredentials {
    email: string;
    password: string;
}

export interface UserRegistration extends UserCredentials {
    fullName: string;
}

const initialState: AuthState = {
    user: null,
    status: "idle",
    error: null,
    isAuthenticated: false
};

// Helper function for auth API calls
const authApi = async (url: string, data: UserCredentials | UserRegistration) => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${url}`, data);
    return response.data;
};

export const signupUser = createAsyncThunk(
    'auth/signup',
    async (userData: UserRegistration, { rejectWithValue }) => {
        try {
            return await authApi('/api/auth/signup', userData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const signinUser = createAsyncThunk(
    'auth/signin',
    async (userData: UserCredentials, { rejectWithValue }) => {
        try {
            return await authApi('/api/auth/signin', userData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);


export const signoutUser = createAsyncThunk(
    'user/signout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/signout`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);


export const googleAuth = createAsyncThunk(
    'auth/google',
    async (userData: GoogleAuthData, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`, userData);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Google authentication failed');
        }
    }
)



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            // Clear token from storage if needed
        },
        setAuthState: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = !!action.payload.user;
        }
    },
    extraReducers: (builder) => {
        builder
            // Signup reducers
            .addCase(signupUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                toast.success(action.payload.message);
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Signin reducers
            .addCase(signinUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(signinUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.isAuthenticated = true;
                toast.success(action.payload.message);
            })
            .addCase(signinUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.isAuthenticated = false;
            })

            // Signout reducers
            .addCase(signoutUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(signoutUser.fulfilled, (state) => {
                state.status = 'idle';
                state.user = null;
                state.isAuthenticated = false;
                toast.success('Logged out successfully');
            })
            .addCase(signoutUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Google auth reducers
            .addCase(googleAuth.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(googleAuth.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.isAuthenticated = true;
                toast.success(action.payload.message);
            })
            .addCase(googleAuth.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.isAuthenticated = false;
            });
    }
});

export const { logout, setAuthState } = authSlice.actions;
export default authSlice.reducer;