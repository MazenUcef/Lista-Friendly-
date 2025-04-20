import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { Post } from "./postSlice";

interface FavoriteState {
    favorites: Post[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    pagination?: {
        total: number;
        currentPage: number;
        totalPages: number;
        pageSize: number;
    };
}


interface ReadFavoritesParams {
    startIndex?: number;
    limit?: number;
}

const initialState: FavoriteState = {
    favorites: [],
    status: "idle",
    error: null
};


interface ToggleFavoriteResponse {
    success: boolean;
    message: string;
    isFavorite: boolean;
    postId: string;
    post?: Post;
}
const token = localStorage.getItem('token')
export const toggleFavorite = createAsyncThunk(
    'favorite/toggle',
    async (postId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/favorites/toggle`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ postId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to toggle favorite');
            }

            return await response.json() as ToggleFavoriteResponse;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to toggle favorite');
        }
    }
);

export const readFavorites = createAsyncThunk(
    'favorite/read',
    async (params: ReadFavoritesParams = {}, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams();
            query.append('startIndex', (params.startIndex ?? 0).toString());
            query.append('limit', (params.limit ?? 10).toString());

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/favorites/read?${query.toString()}`, {
                credentials: 'include',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                method: 'GET',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch favorites');
            }

            const data = await response.json();
            return data.data; // Now contains { posts, pagination }
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch favorites');
        }
    }
);

const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        clearFavoriteError: (state) => {
            state.error = null;
        },
        resetFavoriteStatus: (state) => {
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(toggleFavorite.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(toggleFavorite.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { isFavorite, postId, post } = action.payload;

                if (isFavorite && post) {
                    // Check if post already exists to avoid duplicates
                    const exists = state.favorites.some(fav => fav._id === postId);
                    if (!exists) {
                        state.favorites.unshift(post);
                        toast.success(action.payload.message);
                    }
                } else {
                    state.favorites = state.favorites.filter(fav => fav._id !== postId);
                    toast.success(action.payload.message);
                }
            })
            .addCase(toggleFavorite.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                toast.error(action.payload as string);
            })

            // Read Favorites
            .addCase(readFavorites.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(readFavorites.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.favorites = action.payload.posts; // Changed from favorites to posts
                state.pagination = action.payload.pagination;
            })
            .addCase(readFavorites.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                toast.error(action.payload as string);
            });
    }
});

export const { clearFavoriteError, resetFavoriteStatus } = favoriteSlice.actions;
export default favoriteSlice.reducer;