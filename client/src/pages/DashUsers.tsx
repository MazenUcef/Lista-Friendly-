import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { motion } from 'framer-motion';
import { useDeleteUsers, useGetUsers } from '../api/authApi';
import { User } from '../redux/authSlice';

const DashUsers = () => {
    const { users, stats, fetchUsers, authStatus, error, currentUser } = useGetUsers();
    const { deleteUserByAdmin } = useDeleteUsers();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userId, setUserId] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchUsers({
            startIndex: 0,
            limit: usersPerPage,
            sort: 'desc'
        });
    }, []);

    useEffect(() => {
        if (users) {
            let results = [...users];
            if (searchTerm) {
                results = results.filter(user =>
                    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            setFilteredUsers(results);
        }
    }, [users, searchTerm]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleDeleteClick = (userId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setUserId(userId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteUserByAdmin(userId);
            await fetchUsers({
                startIndex: 0,
                limit: usersPerPage,
                sort: 'desc'
            });

            setShowDeleteModal(false);
        } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Failed to delete user');
        } finally {
            setIsDeleting(false);
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

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
            <Modal show={showDeleteModal} onClose={cancelDelete}>
                <ModalHeader>Confirm Deletion</ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this user? This action cannot be undone.
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
                            Users Management
                        </motion.h1>
                        <div className="flex gap-4">
                            <p className="text-gray-600">
                                {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
                            </p>
                            {stats && (
                                <p className="text-gray-600">
                                    New users this month: {stats.lastMonth}
                                </p>
                            )}
                        </div>
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
                                placeholder="Search users..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#71BE63] focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </motion.div>
                    </div>
                </div>

                {authStatus === 'loading' ? (
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
                                        Profile Image
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Full Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Created At
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
                                {currentUsers.length > 0 ? (
                                    currentUsers.map((user) => (
                                        <motion.tr
                                            key={user._id}
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.01, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                                            className="bg-white hover:bg-gray-50 cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                {user.profilePicture ? (
                                                    <motion.img
                                                        src={user.profilePicture}
                                                        alt={user.fullName}
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
                                                {user.fullName || 'N/A'}
                                            </th>
                                            <td className="px-6 py-4">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${user.isAdmin
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {user.isAdmin ? 'Admin' : 'User'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {formatDate(user.createdAt || '')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center space-x-2">
                                                    {currentUser?._id !== user._id && (
                                                        <motion.div
                                                            whileHover={{ scale: 1.2 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <button
                                                                onClick={(e) => handleDeleteClick(user._id, e)}
                                                                className="font-bold text-xs text-[#71BE63] p-1 cursor-pointer"
                                                            >
                                                                Delete
                                                            </button>
                                                        </motion.div>
                                                    )}
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
                                            No users found
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

export default DashUsers;