import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {  useNavigate } from 'react-router';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { motion } from 'framer-motion';
import { useAllComments, useDeleteComment } from '../api/commentApi';

// types/comment.ts
export interface Comment {
    _id: string;
    postId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    createdAt: string | Date;
    updatedAt?: string | Date;
}

const DashComments = () => {
    const { allComments, status, error, fetchAllComments } = useAllComments();
    const { deleteComment, deleteError } = useDeleteComment();
    const [currentPage, setCurrentPage] = useState(1);
    const [commentsPerPage] = useState(10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();
    const [commentId, setCommentId] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch all comments on component mount
    useEffect(() => {
        fetchAllComments({ page: 1, limit: 10 }).catch((err) => {
            toast.error(typeof err === 'string' ? err : 'Failed to fetch comments');
        });
    }, []);



    // Display read error
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Display delete error
    useEffect(() => {
        if (deleteError) {
            toast.error(deleteError);
        }
    }, [deleteError]);

    const handleDeleteClick = (commentId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setCommentId(commentId);
        setShowDeleteModal(true);
    };

    const handleNavigateToPostPage = (postId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        navigate(`/brand-details/${postId}`, { state: { postId } });
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            const success = await deleteComment(commentId);
            if (success) {
                await fetchAllComments({ page: 1, limit: 10 });
            } else {
                toast.error('Failed to delete comment');
            }
        } catch (error) {
            toast.error('Failed to delete comment');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setCommentId('');
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setCommentId('');
    };

    const formatDate = (date: string | Date) => {
        if (!date) return 'N/A';
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    // Pagination logic
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = allComments.slice(indexOfFirstComment, indexOfLastComment);
    const totalPages = Math.ceil(allComments.length / commentsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        fetchAllComments({ page: pageNumber, limit: commentsPerPage }).catch((err) => {
            toast.error(typeof err === 'string' ? err : 'Failed to fetch comments');
        });
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen p-4 md:p-8 bg-white"
        >
            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onClose={cancelDelete}>
                <ModalHeader>Confirm Deletion</ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this comment? This action cannot be undone.
                        </p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={confirmDelete}
                        disabled={isDeleting}
                        className={`text-white bg-[#71BE63] cursor-pointer focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isDeleting ? 'opacity-50' : ''
                            }`}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={cancelDelete}
                        className="py-2.5 px-5 ms-3 text-sm font-medium cursor-pointer text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100"
                    >
                        Cancel
                    </motion.button>
                </ModalFooter>
            </Modal>

            <div className="">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-3xl md:text-4xl font-bold text-[#71BE63] mb-8 text-start"
                        >
                            Comments Management
                        </motion.h1>
                        <p className="text-gray-600">
                            {allComments.length}{' '}
                            {allComments.length === 1 ? 'comment' : 'comments'} found
                        </p>
                    </div>
                </div>

                {status === 'loading' ? (
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[#71BE63]"
                        ></motion.div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative overflow-x-auto shadow-md sm:rounded-lg"
                    >
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        User Avatar
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        User Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Comment
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Rating
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Created At
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                                {currentComments.length > 0 ? (
                                    currentComments.map((comment) => (
                                        <motion.tr
                                            onClick={(e) => handleNavigateToPostPage(comment.postId, e)}
                                            key={comment._id}
                                            variants={itemVariants}
                                            whileHover={{
                                                scale: 1.01,
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            }}
                                            className="bg-white hover:bg-gray-50 cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                {comment.userAvatar ? (
                                                    <motion.img
                                                        src={comment.userAvatar}
                                                        alt={comment.userName}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        whileHover={{ scale: 1.2 }}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-xs text-gray-500">No Image</span>
                                                    </div>
                                                )}
                                            </td>
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                            >
                                                {comment.userName}
                                            </th>
                                            <td className="px-6 py-4 max-w-[20rem] truncate">
                                                {comment.comment}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                    {comment.rating} / 5
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{formatDate(comment.createdAt)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center space-x-2">
                                                    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                                        <button
                                                            onClick={(e) => handleDeleteClick(comment._id, e)}
                                                            className="font-bold text-xs text-[#71BE63] p-1 cursor-pointer"
                                                        >
                                                            Delete
                                                        </button>
                                                    </motion.div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <motion.tr variants={itemVariants} className="bg-white border-b">
                                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                            No comments found
                                        </td>
                                    </motion.tr>
                                )}
                            </motion.tbody>
                        </table>
                    </motion.div>
                )}

                {/* Pagination */}
                <nav aria-label="Page navigation example" className="w-full flex justify-end mt-4">
                    <ul className="inline-flex -space-x-px text-sm">
                        <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                            >
                                Previous
                            </button>
                        </motion.li>
                        {[...Array(totalPages)].map((_, index) => (
                            <motion.li key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <button
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${currentPage === index + 1 ? 'text-blue-600 bg-blue-50 border-blue-300' : ''
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            </motion.li>
                        ))}
                        <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                            >
                                Next
                            </button>
                        </motion.li>
                    </ul>
                </nav>
            </div>
        </motion.div>
    );
};

export default DashComments;