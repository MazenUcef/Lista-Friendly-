import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { createPost, deletePost, readPosts, updatePost } from '../redux/postSlice';



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

export const useCreatePost = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.post);

    const createNewPost = async (postData: {
        name: string;
        description: string;
        location: string;
        socialLinks: string[];
        brandPicture?: string;
        category: string;
        file?: File;
    }) => {
        try {
            const result = await dispatch(createPost(postData)).unwrap();
            return result;
        } catch (error) {
            throw typeof error === 'string' ? error : 'Failed to create post';
        }
    };

    return {
        createStatus: status,
        createError: error,
        createNewPost,
    };
};



export const useReadPosts = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { posts, pagination, status, error } = useSelector(
        (state: RootState) => state.post
    );

    const fetchPosts = async (params?: ReadPostParams) => {
        try {
            const result = await dispatch(readPosts(params ?? {})).unwrap();
            return result;
        } catch (error) {
            throw typeof error === 'string' ? error : 'Failed to fetch posts';
        }
    };

    return {
        posts,
        pagination,
        readStatus: status,
        readError: error,
        fetchPosts,
    };
};



export const useDeletePost = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.post);

    const deleteExistingPost = async (postId: string, userId: string) => {
        try {
            const res = await dispatch(deletePost({ postId, userId })).unwrap();
            return res;
        } catch (error) {
            throw typeof error === 'string' ? error : 'Failed to delete post';
        }
    }

    return {
        deleteStatus: status,
        deleteError: error,
        deleteExistingPost,
    };

}




export const useUpdatePost = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.post);

    const updateExistingPost = async (postData: {
        postId: string;
        userId: string;
        name?: string;
        description?: string;
        location?: string;
        socialLinks?: string[];
        brandPicture?: string;
        category?: string;
        file?: File;
    }) => {
        try {
            const result = await dispatch(updatePost(postData)).unwrap();
            return result;
        } catch (error) {
            throw typeof error === 'string' ? error : 'Failed to update post';
        }
    };

    return {
        updateStatus: status,
        updateError: error,
        updateExistingPost,
    };
};






