import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

interface User {
    fullName: string;
    email: string;
    profilePicture: string;
}

export interface UserState {
    user: User | null;  // Add user property
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface UpdateUserData {
    userId: string;
    fullName?: string;
    email?: string;
    password?: string;
    profilePicture?: string;
}

const initialState: UserState = {
    user: null,  // Initialize user as null
    status: 'idle',
    error: null,
};


export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (updateData: UpdateUserData, { rejectWithValue }) => {
        try {
            const { userId, ...updateFields } = updateData;
            const response = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/user/update/${userId}`,
                updateFields,
                {
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'User update failed');
        }
    }
);





const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = {
                fullName: action.payload.fullName,
                email: action.payload.email,
                profilePicture: action.payload.profilePicture,
            };
        },
        clearUser: (state) => {
            state.user = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Update the user data in state
                if (state.user && action.payload.user) {
                    state.user = {
                        ...state.user,
                        ...action.payload.user
                    };
                }
                toast.success(action.payload.message);
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;