import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import StarRating from './StarRating';
import { useAddComment, useGetComments } from '../api/commentApi';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const CommentSection = ({ postId }: { postId: string }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);

    const {
        comments,
        pagination,
        fetchComments,
        readStatus,
        readError
    } = useGetComments();

    const {
        addNewComment,
        addStatus,
        addError
    } = useAddComment();

    // Fetch comments when the component mounts or postId changes
    useEffect(() => {
        if (postId) {
            fetchComments({ postId, page: 1, limit: 5 })
                .catch((err) => {
                    toast.error(typeof err === 'string' ? err : 'Failed to fetch comments');
                });
        }
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || rating === 0) {
            toast.error('Please provide both a rating and comment');
            return;
        }

        try {
            await addNewComment({
                postId,
                rating,
                comment: newComment,
                userId: user?._id || '',
                userName: user?.fullName || '',
                userAvatar: user?.profilePicture || ''
            });

            setNewComment('');
            setRating(0);
            // Refetch comments after adding a new one
            await fetchComments({ postId, page: 1, limit: 5 });
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : 'Failed to add comment';
            toast.error(errorMessage);
        }
    };

    const formatDate = (date: string | Date) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <motion.div
            className="mt-12 bg-white rounded-xl shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>

            {/* Add Comment Form */}
            <motion.form
                onSubmit={handleSubmit}
                className="mb-8 p-6 bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.005 }}
            >
                <h3 className="text-lg font-semibold mb-4">Add Your Review</h3>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Your Rating</label>
                    <StarRating
                        value={rating}
                        onChange={setRating}
                        interactive
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="comment" className="block text-gray-700 mb-2">
                        Your Review
                    </label>
                    <textarea
                        id="comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71BE63]"
                        rows={4}
                        placeholder="Share your experience with this brand..."
                        required
                    />
                </div>

                <motion.button
                    type="submit"
                    className="bg-[#71BE63] cursor-pointer text-white px-6 py-2 rounded-lg font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={addStatus === 'loading'}
                >
                    {addStatus === 'loading' ? 'Submitting...' : 'Submit Review'}
                </motion.button>
            </motion.form>

            {/* Comments List */}
            <div className="space-y-6">
                {readStatus === 'loading' ? (
                    <div className="flex justify-center py-8">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="rounded-full h-8 w-8 border-t-2 border-b-2 border-[#71BE63]"
                        />
                    </div>
                ) : comments?.length > 0 ? (
                    comments.map((comment) => (
                        <motion.div
                            key={comment._id}
                            className="p-6 border border-gray-200 rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            whileHover={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-3">
                                    {comment.userAvatar && (
                                        <img
                                            src={comment.userAvatar}
                                            alt={comment.userName}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    )}
                                    <h4 className="font-semibold text-gray-800">{comment.userName}</h4>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {formatDate(comment.createdAt)}
                                </span>
                            </div>

                            <div className="mb-3">
                                <StarRating value={comment.rating} />
                            </div>

                            <p className="text-gray-600 whitespace-pre-line">{comment.comment}</p>
                        </motion.div>
                    ))
                ) : (
                    <motion.div
                        className="text-center py-8 text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        No reviews yet. Be the first to review!
                    </motion.div>
                )}
            </div>

            {/* Error display */}
            {(readError || addError) && (
                <div className="mt-4 text-red-500 text-center">
                    {readError || addError}
                </div>
            )}

            {/* Pagination (Optional) */}
            {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex justify-center space-x-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <motion.button
                            key={page}
                            onClick={() => fetchComments({ postId, page, limit: 5 })}
                            className={`px-4 py-2 rounded-lg cursor-pointer ${pagination.currentPage === page
                                    ? 'bg-[#71BE63] text-white'
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {page}
                        </motion.button>
                    ))}
                </div>
            )}
        </motion.div>
    );
};