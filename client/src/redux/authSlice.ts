import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export interface User {
    _id: string;
    fullName?: string;
    email?: string;
    profilePicture?: string;
    isAdmin?: boolean;
    createdAt?: string; // Added createdAt property
}

interface AuthState {
    user: User | null;
    usersList: User[]; // For storing fetched users
    pagination: {
        total: number;
        limit: number;
        offset: number;
    } | null;
    stats: {
        lastMonth: number;
    } | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    isAuthenticated: boolean;
}

export interface UserListResponse {
    users: User[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
    };
    stats: {
        lastMonth: number;
    };
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
    usersList: [],
    pagination: {
        total: 0,
        limit: 0,
        offset: 0,
    },
    stats: {
        lastMonth: 0,
    },
    status: "idle",
    error: null,
    isAuthenticated: false
};

// Helper function for auth API calls
const authApi = async (url: string, data: UserCredentials | UserRegistration) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`,
        {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(data),
        }
    );
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
    }
    const responseData = await response.json();
    return responseData;
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
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/signout`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Logout failed');
            }
            const responseData = await response.json();
            return responseData;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);


export const googleAuth = createAsyncThunk(
    'auth/google',
    async (userData: GoogleAuthData, { rejectWithValue }) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(userData),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Authentication failed');
            }
            const responseData = await res.json();
            return responseData;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Google authentication failed');
        }
    }
)



export const updateUser = createAsyncThunk(
    'user/update',
    async (updateData: {
        userId: string;
        formData: {
            fullName?: string;
            email?: string;
            password?: string;
            profilePicture?: string;
        };
        file?: File;
    }, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            // Append regular fields
            if (updateData.formData.fullName) formData.append('fullName', updateData.formData.fullName);
            if (updateData.formData.email) formData.append('email', updateData.formData.email);
            if (updateData.formData.password) formData.append('password', updateData.formData.password);
            if (updateData.formData.profilePicture) formData.append('profilePicture', updateData.formData.profilePicture);

            // Append file if exists
            if (updateData.file) formData.append('profilePicture', updateData.file);

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/update/${updateData.userId}`, {
                credentials: 'include',
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'User update failed');
            }

            const responseData = await response.json();
            return responseData;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update user');
        }
    }
);



export const deleteUser = createAsyncThunk(
    'user/delete',
    async (userId: string, { rejectWithValue }) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/delete/${userId}`,
                {
                    credentials: 'include',
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'User deletion failed');
            }

            const data = await res.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'User deletion failed');
        }
    }
)




export const getUsers = createAsyncThunk(
    'users/getAll',
    async (
        params: {
            startIndex?: number;
            limit?: number;
            sort?: 'asc' | 'desc';
        },
        { rejectWithValue }
    ) => {
        try {
            // Construct query parameters
            const queryParams = new URLSearchParams();
            if (params.startIndex !== undefined) queryParams.append('startIndex', params.startIndex.toString());
            if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
            if (params.sort) queryParams.append('sort', params.sort);

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/user/getUser?${queryParams.toString()}`,
                {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch users');
            }

            const responseData = await response.json();
            return responseData.data; // Note: Added .data to match your backend response structure
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch users');
        }
    }
);




export const deleteUsers = createAsyncThunk(
    'users/deleteByAdmin',
    async (userId: string, { rejectWithValue }) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/user/admin-delete/${userId}`,
                {
                    credentials: 'include',
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'User deletion by admin failed');
            }

            const data = await res.json();
            return {
                data,
                deletedUserId: userId // Include the deleted user ID in the response
            };
        } catch (error: any) {
            return rejectWithValue(error.message || 'User deletion by admin failed');
        }
    }
);




const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
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
            })


            // Update user reducers
            .addCase(updateUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                toast.success(action.payload.message);
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })


            // Delete user reducers
            .addCase(deleteUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.status = 'succeeded';
                state.user = null;
                state.isAuthenticated = false;
                toast.success('Account deleted successfully');
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })


            .addCase(getUsers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.usersList = action.payload.users;
                state.pagination = action.payload.pagination;
                state.stats = action.payload.stats;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })



            .addCase(deleteUsers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.usersList = state.usersList.filter(user => user._id !== action.payload.deletedUserId);
                if (state.user?._id === action.payload.deletedUserId) {
                    state.user = null;
                    state.isAuthenticated = false;
                }
                toast.success(action.payload.data.message || 'User deleted successfully by admin');
            })
            .addCase(deleteUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                toast.error(action.payload as string || 'Failed to delete user');
            })
    }
});

export const { logout, setAuthState } = authSlice.actions;
export default authSlice.reducer;