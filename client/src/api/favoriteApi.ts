import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { readFavorites, toggleFavorite } from '../redux/favSlice';

export const useToggleFavorite = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { status, error } = useSelector((state: RootState) => state.fav);

    const toggleFavoritePost = async (postId: string) => {
        try {
            const result = await dispatch(toggleFavorite(postId)).unwrap();
            return result;
        } catch (error) {
            console.error('Error toggling favorite:', error);
            throw error;
        }
    };

    return {
        toggleStatus: status,
        toggleError: error,
        toggleFavoritePost,
    };
};

interface ReadFavoritesParams {
    startIndex?: number;
    limit?: number;
}

export const useReadFavorites = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { favorites, pagination, status, error } = useSelector(
        (state: RootState) => state.fav
    );

    const fetchFavorites = async (params?: ReadFavoritesParams) => {
        try {
            const result = await dispatch(readFavorites(params ?? {})).unwrap();
            return {
                posts: result.posts, // Return posts instead of favorites
                pagination: result.pagination
            };
        } catch (error) {
            throw typeof error === 'string' ? error : 'Failed to fetch favorites';
        }
    };

    return {
        favorites,
        pagination,
        readStatus: status,
        readError: error,
        fetchFavorites,
    };
};