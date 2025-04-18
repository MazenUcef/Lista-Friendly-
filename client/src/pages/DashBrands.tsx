import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';
import { FaPlus } from 'react-icons/fa';
import { useDeletePost, useReadPosts } from '../api/postsApi';
import { Post } from '../redux/postSlice';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const AdminPosts = () => {
    const { posts, readStatus, readError, fetchPosts } = useReadPosts();
    const userId = useSelector((state: RootState) => state.auth.user?._id)
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate()
    const [postId, setPostId] = useState('');
    const { deleteExistingPost } = useDeletePost();
    const [isDeleting, setIsDeleting] = useState(false);


    useEffect(() => {
        fetchPosts({
            limit: 100,
            order: 'desc'
        });
    }, []);

    useEffect(() => {
        if (posts) {
            let results = [...posts];
            if (searchTerm) {
                results = results.filter(post =>
                    post.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.category.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            setFilteredPosts(results);
        }
    }, [posts, searchTerm]);

    useEffect(() => {
        if (readError) {
            toast.error(readError);
        }
    }, [readError]);

    const handleDeleteClick = (postId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setPostId(postId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            if (userId) {
                await deleteExistingPost(postId, userId);
            }
        } catch (error) {
            toast.error('Failed to delete post');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
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
                            Are you sure you want to delete this post? This action cannot be undone.
                        </p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={confirmDelete}
                        disabled={isDeleting}
                        className={`text-white bg-[#71BE63] cursor-pointer focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isDeleting ? 'opacity-50' : ''}`}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={cancelDelete}
                        className="py-2.5 px-5 ms-3 text-sm font-medium  cursor-pointer text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100"
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
                            Brands Management
                        </motion.h1>
                        <p className="text-gray-600">
                            {filteredPosts.length} {filteredPosts.length === 1 ? 'brand' : 'brands'} found
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="relative flex-grow"
                        >
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search brand..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#71BE63] focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/dashboard/create"
                                className="flex items-center justify-center px-4 py-2 bg-[#71BE63] text-white rounded-lg hover:bg-[#5fa955] transition-colors"
                            >
                                <FaPlus className="mr-2" />
                                New Brand
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {readStatus === 'loading' ? (
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
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
                                        Brand Image
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Brand Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Description
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Updated At
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <motion.tbody
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {currentPosts.length > 0 ? (
                                    currentPosts.map((post) => (
                                        <motion.tr
                                            onClick={() => {
                                                navigate(`/dashboard/create/${post._id}`)
                                            }}
                                            key={post._id}
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.01, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                                            className="bg-white hover:bg-gray-50 cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                {post.brandPicture ? (
                                                    <motion.img
                                                        src={post.brandPicture}
                                                        alt={post.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        whileHover={{ scale: 1.2 }}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-xs text-gray-500">No Image</span>
                                                    </div>
                                                )}
                                            </td>
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                {post.name}
                                            </th>
                                            <td className="px-6 py-4 max-w-[2rem] truncate">
                                                {post.description}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                    {post.category || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {formatDate(post.updatedAt || post.createdAt || '')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center space-x-2">
                                                    <motion.div
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Link
                                                            to={`/admin/posts/edit/${post._id}`}
                                                            className="font-bold text-xs text-[#71BE63] p-1 cursor-pointer"
                                                        >
                                                            Edit
                                                        </Link>
                                                    </motion.div>
                                                    <motion.div
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <button
                                                            onClick={(e) => handleDeleteClick(post._id, e)}
                                                            className="font-bold text-xs text-red-500 p-1 cursor-pointer"
                                                        >
                                                            Delete
                                                        </button>
                                                    </motion.div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <motion.tr
                                        variants={itemVariants}
                                        className="bg-white border-b"
                                    >
                                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                            No posts found
                                        </td>
                                    </motion.tr>
                                )}
                            </motion.tbody>
                        </table>
                    </motion.div>
                )}

                {/* Pagination */}
                <nav aria-label="Page navigation example" className='w-full flex justify-end mt-4'>
                    <ul className="inline-flex -space-x-px text-sm">
                        <motion.li
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                            >
                                Previous
                            </button>
                        </motion.li>
                        {[...Array(totalPages)].map((_, index) => (
                            <motion.li
                                key={index}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <button
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${currentPage === index + 1 ? 'text-blue-600 bg-blue-50 border-blue-300' : ''}`}
                                >
                                    {index + 1}
                                </button>
                            </motion.li>
                        ))}
                        <motion.li
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
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

export default AdminPosts;