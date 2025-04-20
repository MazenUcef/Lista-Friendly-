import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";




export interface Post {
    _id: string;
    userId: string;
    name: string;
    description: string;
    location: string;
    category: string;
    socialLinks: string[];
    brandPicture: string;
    slug: string;
    createdAt?: string;
    updatedAt?: string;
    isFavorite?: boolean;
}
interface ReadPostParams {
    userId?: string;
    category?: string;
    slug?: string;
    postId?: string;
    searchTerm?: string;
    startIndex?: number;
    limit?: number;
    order?: 'asc' | 'desc';
}


export interface UpdatePostData {
    postId: string;
    userId: string;
    name?: string;
    description?: string;
    location?: string;
    category?: string;
    socialLinks?: string[];
    brandPicture?: string;
    file?: File;
}


export interface Pagination {
    total: number;
    lastMonth: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
}

export interface PostState {
    posts: Post[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    pagination?: Pagination;
}

export interface PostState {
    posts: Post[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface CreatePostData {
    name: string;
    description: string;
    location: string;
    category: string;
    socialLinks: string[];
    brandPicture?: string;
    file?: File;
}


const initialState: PostState = {
    posts: [],
    status: "idle",
    error: null
};
const token = localStorage.getItem('token')

export const createPost = createAsyncThunk(
    'post/create',
    async (postData: CreatePostData, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            // Append required fields
            formData.append('name', postData.name);
            formData.append('description', postData.description);
            formData.append('location', postData.location);
            formData.append('category', postData.category || 'uncategorized');
            formData.append('socialLinks', JSON.stringify(postData.socialLinks));

            // Append image if exists
            if (postData.file) {
                formData.append('brandPicture', postData.file);
            } else if (postData.brandPicture) {
                formData.append('brandPicture', postData.brandPicture);
            }

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/post/create`, {
                credentials: 'include',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create post');
            }

            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create post');
        }
    }
);




export const readPosts = createAsyncThunk(
    'post/read',
    async (params: ReadPostParams = {}, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams();

            if (params.userId) query.append('userId', params.userId);
            if (params.category) query.append('category', params.category);
            if (params.slug) query.append('slug', params.slug);
            if (params.postId) query.append('postId', params.postId);
            if (params.searchTerm) query.append('searchTerm', params.searchTerm);
            query.append('startIndex', (params.startIndex ?? 0).toString());
            query.append('limit', (params.limit ?? 10).toString());
            query.append('order', params.order || 'desc');

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/post/read?${query.toString()}`, {
                credentials: 'include',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                method: 'GET',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch posts');
            }

            const data = await response.json();
            return data.data; // contains { posts, pagination }
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch posts');
        }
    }
);



export const deletePost = createAsyncThunk(
    'post/delete',
    async ({ postId, userId }: { postId: string, userId: string }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/post/delete/${postId}/${userId}`, {
                credentials: 'include',
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to delete post');
            }

            // Handle case where response has no content
            if (res.status === 204) {
                return { postId, message: 'Post deleted successfully' };
            }

            return await res.json();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete post');
        }
    }
);




export const updatePost = createAsyncThunk(
    'post/update',
    async (postData: UpdatePostData, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            // Append required fields
            if (postData.name) formData.append('name', postData.name);
            if (postData.description) formData.append('description', postData.description);
            if (postData.location) formData.append('location', postData.location);
            if (postData.category) formData.append('category', postData.category);
            if (postData.socialLinks) {
                formData.append('socialLinks', JSON.stringify(postData.socialLinks));
            }

            // Append image if exists
            if (postData.file) {
                formData.append('brandPicture', postData.file);
            } else if (postData.brandPicture) {
                formData.append('brandPicture', postData.brandPicture);
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/post/update/${postData.postId}/${postData.userId}`,
                {
                    credentials: 'include',
                    method: 'PUT',
                    headers:{
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update post');
            }

            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update post');
        }
    }
);



const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        clearPostError: (state) => {
            state.error = null;
        },
        resetPostStatus: (state) => {
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Post
            .addCase(createPost.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts.unshift(action.payload.post);
                toast.success(action.payload.message);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                toast.error(action.payload as string);
            })

            // Fetch posts
            .addCase(readPosts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(readPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload.posts;
                state.pagination = action.payload.pagination;
            })
            .addCase(readPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                toast.error(action.payload as string);
            })

            // Delete Post
            .addCase(deletePost.pending, (state, action) => {
                state.status = 'loading';
                state.error = null;
                // Optimistically remove the post
                state.posts = state.posts.filter(post => post._id !== action.meta.arg.postId);
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = state.posts.filter(post => post._id !== action.payload.postId);
                toast.success(action.payload.message);
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                toast.error(action.payload as string);
            })


            .addCase(updatePost.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Find and update the post in the state
                const index = state.posts.findIndex(post => post._id === action.payload.post._id);
                if (index !== -1) {
                    state.posts[index] = action.payload.post;
                }
                toast.success(action.payload.message);
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                toast.error(action.payload as string);
            });
    }
});

export const { clearPostError, resetPostStatus } = postSlice.actions;
export default postSlice.reducer;