import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { addComment, deleteComment, getAllComments, getComments } from '../redux/CommentSlice';

interface ReadCommentsParams {
    postId: string;
    page?: number;
    limit?: number;
}

export const useAddComment = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.comments);

    const addNewComment = async (commentData: {
        postId: string;
        rating: number;
        comment: string;
        userId: string;
        userName: string;
        userAvatar: string;
    }) => {
        try {
            const result = await dispatch(addComment(commentData)).unwrap();
            return result;
        } catch (error) {
            throw typeof error === 'string' ? error : 'Failed to add comment';
        }
    };

    return {
        addStatus: status,
        addError: error,
        addNewComment,
    };
};

export const useGetComments = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { comments, pagination, status, error } = useSelector(
        (state: RootState) => state.comments
    );

    const fetchComments = async (params: ReadCommentsParams) => {
        try {
            const result = await dispatch(getComments(params)).unwrap();
            return result;
        } catch (error) {
            throw typeof error === 'string' ? error : 'Failed to fetch comments';
        }
    };

    return {
        comments,
        pagination,
        readStatus: status,
        readError: error,
        fetchComments,
    };
};



export const useDeleteComment = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.comments);

    const deleteCommentById = async (commentId: string) => {
        try {
            await dispatch(deleteComment(commentId)).unwrap();
            return true;
        } catch (error) {
            console.error('Failed to delete comment:', error);
            return false;
        }
    };

    return {
        deleteStatus: status,
        deleteError: error,
        deleteComment: deleteCommentById
    };
};





export const useAllComments = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { comments, pagination, status, error } = useSelector(
        (state: RootState) => state.comments
    );

    const fetchAllComments = async (params?: { page?: number; limit?: number }) => {
        try {
            const result = await dispatch(getAllComments(params || {})).unwrap();
            return result;
        } catch (error) {
            throw typeof error === 'string' ? error : 'Failed to fetch comments';
        }
    };

    return {
        allComments: comments,
        pagination,
        status,
        error,
        fetchAllComments
    };
};