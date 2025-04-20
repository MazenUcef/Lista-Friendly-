import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";


interface Comment {
    _id: string;
    postId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

interface GetAllCommentsParams {
    page?: number;
    limit?: number;
}

interface CommentState {
    comments: Comment[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    pagination?: {
        total: number;
        currentPage: number;
        totalPages: number;
        pageSize: number;
    };
}

interface ReadCommentsParams {
    postId: string;
    page?: number;
    limit?: number;
}

interface AddCommentParams {
    postId: string;
    rating: number;
    comment: string;
    userId: string;
    userName: string;
    userAvatar: string;

}
const token = localStorage.getItem('token')
const initialState: CommentState = {
    comments: [],
    status: "idle",
    error: null
};

export const addComment = createAsyncThunk(
    'comments/addComment',
    async ({ postId, rating, comment, userId, userName, userAvatar }: AddCommentParams, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/comments/addComment`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ postId, rating, comment, userId, userName, userAvatar })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add comment');
            }

            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to add comment');
        }
    }
);

export const getComments = createAsyncThunk(
    'comments/getComments',
    async ({ postId, page = 1, limit = 10 }: ReadCommentsParams, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams();
            query.append('page', page.toString());
            query.append('limit', limit.toString());

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/comments/getComments/${postId}?${query.toString()}`, {
                credentials: 'include',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                method: 'GET',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch comments');
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch comments');
        }
    }
);


export const deleteComment = createAsyncThunk(
    'comments/deleteComments',
    async (commentId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/comments/deleteComments/${commentId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete comment');
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete comment');
        }
    }
);



export const getAllComments = createAsyncThunk(
    'comments/getAllComments',
    async ({ page = 1, limit = 20 }: GetAllCommentsParams, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams();
            query.append('page', page.toString());
            query.append('limit', limit.toString());

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/comments/getAllComments?${query.toString()}`, {
                credentials: 'include',
                method: 'GET',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch comments');
            }

            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch comments');
        }
    }
);

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        clearCommentError: (state) => {
            state.error = null;
        },
        resetCommentStatus: (state) => {
            state.status = 'idle';
        },
        addNewComment: (state, action) => {
            state.comments.unshift(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // Add Comment
            .addCase(addComment.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.comments.unshift(action.payload.comment);
                toast.success(action.payload.message);
            })
            .addCase(addComment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                toast.error(action.payload as string);
            })

            // Get Comments
            .addCase(getComments.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.comments = action.payload.comments;
                state.pagination = {
                    total: action.payload.totalCount,
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    pageSize: action.payload.limit
                };
            })
            .addCase(getComments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                toast.error(action.payload as string);
            })


            .addCase(deleteComment.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.comments = state.comments.filter(
                    comment => comment._id !== action.payload.comment._id
                );
                toast.success(action.payload.message);
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                toast.error(action.payload as string);
            })


            .addCase(getAllComments.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getAllComments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.comments = action.payload.comments;
                state.pagination = {
                    total: action.payload.totalCount,
                    currentPage: action.payload.currentPage,
                    totalPages: action.payload.totalPages,
                    pageSize: action.payload.limit
                };
            })
            .addCase(getAllComments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                toast.error(action.payload as string);
            });
    }
});

export const { clearCommentError, resetCommentStatus, addNewComment } = commentSlice.actions;
export default commentSlice.reducer;