import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";



interface AuthState {
    user: null | any;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null
}
export interface UserData {
    fullName: string;
    email: string;
    password: string
}



const initialState: AuthState = {
    user: null,
    status: "idle",
    error: null
};


export const signupUser = createAsyncThunk(
    'auth/signup',
    async (userData: UserData, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
                userData
            );
            return res.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Signup failed';
            return rejectWithValue(errorMessage);
        }
    }
);




const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user
                toast.success(action.payload.message);
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
    }
})



export const { logout } = authSlice.actions;
export default authSlice.reducer;