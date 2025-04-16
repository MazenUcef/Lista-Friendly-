import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../store';
import { Controller, useForm } from 'react-hook-form';
import { FaCamera, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { useRef, useState } from 'react';
import { useDeleteUser, useUpdateUser } from '../api/authApi';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';


type UpdateFormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const Profile = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { update, authStatus } = useUpdateUser();
    const { deleteAccount } = useDeleteUser();
    const filePickerRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { control, handleSubmit, watch, formState: { errors }, reset } = useForm<UpdateFormData>({
        defaultValues: {
            name: user?.fullName || '',
            email: user?.email || '',
            password: '',
            confirmPassword: '',
        }
    });
    const password = watch('password');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create a preview URL for the selected image
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setSelectedImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: UpdateFormData) => {
        try {
            // Prepare the update data
            const updateData = {
                userId: user?._id || '', // Make sure user exists
                formData: {
                    fullName: data.name,
                    email: data.email,
                    ...(data.password && { password: data.password }), // Only include if provided
                    ...(selectedImage && { profilePicture: selectedImage }), // Only include if new image selected
                },
                file: filePickerRef.current?.files?.[0], // Include the file if selected
            };

            // Call the update function
            await update(updateData);

            // Reset password fields after successful update
            reset({
                name: data.name,
                email: data.email,
                password: '',
                confirmPassword: '',
            });

            // Clear the selected image state if we used it
            if (filePickerRef.current) {
                filePickerRef.current.value = '';
            }

        } catch (error) {
            console.error('Update failed:', error);
            // Error handling is already done in the useUpdateUser hook
        }
    };



    const handleDelete = () => {
        setShowDeleteModal(true);
    }

    const confirmDelete = () => {
        if (user?._id) {
            deleteAccount(user._id);
        }
        setShowDeleteModal(false);
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
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
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full min-h-screen p-4 md:p-10 flex flex-col"
        >
            {/* Profile Header */}
            <motion.div
                variants={itemVariants}
                className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10"
            >
                <div className='flex flex-col md:flex-row items-center gap-4 md:gap-7'>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative"
                    >
                        <div
                            onClick={() => filePickerRef.current?.click()}
                            className="cursor-pointer relative group"
                        >
                            <img
                                className="w-24 h-24 md:w-40 md:h-40 rounded-full object-cover border-2 border-[#73bf63]"
                                src={selectedImage || user?.profilePicture || '/default-avatar.png'}
                                alt="Profile"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <FaCamera className="text-white text-2xl" />
                            </div>
                        </div>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                            ref={filePickerRef}
                            hidden
                        />
                    </motion.div>
                    <div className="text-center md:text-left">
                        <motion.h1
                            className='text-lg md:text-xl font-semibold'
                            whileHover={{ color: '#73bf63' }}
                        >
                            {user?.fullName}
                        </motion.h1>
                        <motion.h1
                            className='text-sm md:text-base text-gray-400'
                            whileHover={{ color: '#73bf63' }}
                        >
                            {user?.email}
                        </motion.h1>
                    </div>
                </div>
            </motion.div>

            {/* Form */}
            <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 md:mt-10"
                variants={containerVariants}
            >
                {/* Name & Email Row */}
                <motion.div
                    variants={itemVariants}
                    className='flex flex-col md:flex-row items-center gap-4 md:gap-10'
                >
                    <div className="w-full md:flex-1">
                        <label className="block text-gray-700 mb-2">Full Name</label>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Name is required' }}
                            render={({ field }) => (
                                <motion.div
                                    className="relative"
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="text-gray-400" />
                                    </div>
                                    <input
                                        {...field}
                                        type="text"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Your name"
                                    />
                                </motion.div>
                            )}
                        />
                        {errors.name && (
                            <motion.p
                                className="text-red-500 text-sm mt-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {errors.name.message}
                            </motion.p>
                        )}
                    </div>

                    <div className="w-full md:flex-1 mt-4 md:mt-0">
                        <label className="block text-gray-700 mb-2">Email Address</label>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            }}
                            render={({ field }) => (
                                <motion.div
                                    className="relative"
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400" />
                                    </div>
                                    <input
                                        {...field}
                                        type="email"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="your@email.com"
                                    />
                                </motion.div>
                            )}
                        />
                        {errors.email && (
                            <motion.p
                                className="text-red-500 text-sm mt-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {errors.email.message}
                            </motion.p>
                        )}
                    </div>
                </motion.div>

                {/* Password Row */}
                <motion.div
                    variants={itemVariants}
                    className='flex flex-col md:flex-row items-center gap-4 md:gap-10 mt-6 md:mt-10'
                >
                    <div className="w-full md:flex-1">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                }
                            }}
                            render={({ field }) => (
                                <motion.div
                                    className="relative"
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <input
                                        {...field}
                                        type="password"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="••••••••"
                                    />
                                </motion.div>
                            )}
                        />
                        {errors.password && (
                            <motion.p
                                className="text-red-500 text-sm mt-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {errors.password.message}
                            </motion.p>
                        )}
                    </div>

                    <div className="w-full md:flex-1 mt-4 md:mt-0">
                        <label className="block text-gray-700 mb-2">Confirm Password</label>
                        <Controller
                            name="confirmPassword"
                            control={control}
                            rules={{
                                required: 'Please confirm your password',
                                validate: value =>
                                    !password || value === password || 'Passwords do not match'
                            }}
                            render={({ field }) => (
                                <motion.div
                                    className="relative"
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <input
                                        {...field}
                                        type="password"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="••••••••"
                                    />
                                </motion.div>
                            )}
                        />
                        {errors.confirmPassword && (
                            <motion.p
                                className="text-red-500 text-sm mt-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {errors.confirmPassword.message}
                            </motion.p>
                        )}
                    </div>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    variants={itemVariants}
                    className='mt-8 md:mt-10 w-full flex flex-col sm:flex-row justify-start gap-4'
                >
                    <motion.button
                        type='submit'
                        className='px-6 py-2 h-auto md:h-10 bg-[#73bf63] rounded-md cursor-pointer hover:bg-[#5aa34a] text-white font-semibold'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={authStatus === 'loading'}
                    >
                        {authStatus === 'loading' ? 'Updating...' : 'Save Changes'}
                    </motion.button>
                    <motion.button
                        type='button'
                        onClick={handleDelete}
                        className='px-6 py-2 h-auto md:h-10 bg-white border-2 border-[#73bf63] rounded-md cursor-pointer text-[#73bf63] font-semibold'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Delete Account
                    </motion.button>
                </motion.div>
            </motion.form>
            {showDeleteModal && (
                <DeleteConfirmationModal
                    confirmDelete={confirmDelete}
                    setShowDeleteModal={setShowDeleteModal}
                />
            )}
        </motion.div>
    );
};

export default Profile;