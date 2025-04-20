import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useUpdatePost, useReadPosts } from '../api/postsApi';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useForm, Controller, SubmitHandler, useFieldArray } from 'react-hook-form';

interface FormData {
    name: string;
    description: string;
    location: string;
    category: string;
    socialLinks: {
        id: string;  // Required by useFieldArray
        value: string;
    }[];  // Modified to include id field
    brandPicture: string;
}

const UpdatePostPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.auth.user?._id);
    const { updateExistingPost, updateStatus, updateError } = useUpdatePost();
    const { posts, fetchPosts } = useReadPosts();
    const [file, setFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState('');

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<FormData>({
        defaultValues: {
            name: '',
            description: '',
            location: '',
            category: '',
            socialLinks: [{ id: '', value: '' }],
            brandPicture: '',
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "socialLinks",
    });

    useEffect(() => {
        if (postId) {
            fetchPosts({ postId });
        }
    }, [postId]);

    useEffect(() => {
        if (posts.length > 0 && postId) {
            const post = posts.find(p => p._id === postId);
            if (post) {
                reset({
                    name: post.name,
                    description: post.description,
                    location: post.location,
                    category: post.category,
                    socialLinks: post.socialLinks?.map(link => ({ 
                        id: Math.random().toString(36).substring(2, 9), 
                        value: link 
                    })) || [{ id: '', value: '' }],
                    brandPicture: post.brandPicture,
                });
                setPreviewImage(post.brandPicture);
            }
        }
    }, [posts, postId, reset]);

    useEffect(() => {
        if (updateError) {
            toast.error(updateError);
        }
    }, [updateError]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreviewImage(result);
                setValue('brandPicture', result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (!userId || !postId) return;

        try {
            await updateExistingPost({
                postId,
                userId,
                name: data.name,
                description: data.description,
                location: data.location,
                category: data.category,
                socialLinks: data.socialLinks.map(link => link.value).filter(link => link.trim() !== ''),
                brandPicture: data.brandPicture,
                file: file || undefined,
            });
            navigate('/dashboard/brands');
        } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Failed to update post');
        }
    };


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: "beforeChildren"
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
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen p-4 md:p-8 bg-white"
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto"
            >
                <motion.div variants={itemVariants}>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#71BE63] mb-6">Update Brand</h1>
                    <p className="text-gray-600 mb-8">Edit your brand information below</p>
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                    >
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Brand Name */}
                            <motion.div variants={itemVariants}>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Brand Name *
                                </label>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: 'Brand name is required' }}
                                    render={({ field }) => (
                                        <>
                                            <input
                                                {...field}
                                                type="text"
                                                id="name"
                                                className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71BE63]`}
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                            )}
                                        </>
                                    )}
                                />
                            </motion.div>

                            {/* Category */}
                            <motion.div variants={itemVariants}>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: 'Category is required' }}
                                    render={({ field }) => (
                                        <>
                                            <select
                                                {...field}
                                                id="category"
                                                className={`w-full px-4 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71BE63]`}
                                            >
                                                <option value="">Select a category</option>
                                                <option value="fashion">Fashion</option>
                                                <option value="food">Food</option>
                                                <option value="technology">Technology</option>
                                                <option value="health">Health & Wellness</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {errors.category && (
                                                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                                            )}
                                        </>
                                    )}
                                />
                            </motion.div>

                            {/* Location */}
                            <motion.div variants={itemVariants}>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <Controller
                                    name="location"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            id="location"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71BE63]"
                                        />
                                    )}
                                />
                            </motion.div>
                        </div>

                        {/* Right Column - Image Upload */}
                        <motion.div variants={itemVariants} className="flex flex-col items-center">
                            <div className="relative w-40 h-40 mb-4">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    className="w-full h-full rounded-full overflow-hidden border-4 border-[#71BE63] shadow-lg"
                                >
                                    {previewImage ? (
                                        <motion.img
                                            src={previewImage}
                                            alt="Brand Preview"
                                            className="w-full h-full object-cover"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500">No Image</span>
                                        </div>
                                    )}
                                </motion.div>

                                <motion.label
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    htmlFor="brandPicture"
                                    className="absolute -bottom-2 -right-2 bg-[#71BE63] text-white p-2 rounded-full cursor-pointer shadow-md"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <input
                                        id="brandPicture"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </motion.label>
                            </div>
                            <p className="text-sm text-gray-500 text-center">
                                Click the camera icon to upload a new brand image
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Description */}
                    <motion.div variants={itemVariants} className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: 'Description is required' }}
                            render={({ field }) => (
                                <>
                                    <textarea
                                        {...field}
                                        id="description"
                                        rows={4}
                                        className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71BE63]`}
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                    )}
                                </>
                            )}
                        />
                    </motion.div>

                    {/* Social Links */}
                    <motion.div variants={itemVariants} className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Social Links
                        </label>
                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <motion.div
                                    key={field.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="flex items-center space-x-2"
                                >
                                    <Controller
                                        name={`socialLinks.${index}`}
                                        control={control}
                                        rules={{
                                            pattern: {
                                                value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                                                message: "Please enter a valid URL"
                                            }
                                        }}
                                        render={({ field }) => (
                                            <div className="flex-1">
                                                <input
                                                    {...field}
                                                    value={field.value.value} // Bind only the 'value' field
                                                    onChange={(e) => field.onChange({ ...field.value, value: e.target.value })} // Update the object correctly
                                                    type="url"
                                                    placeholder={`Social link #${index + 1}`}
                                                    className={`w-full px-4 py-2 border ${errors.socialLinks?.[index] ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71BE63]`}
                                                />
                                                {errors.socialLinks?.[index] && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.socialLinks[index]?.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    />
                                    {fields.length > 1 && (
                                        <motion.button
                                            type="button"
                                            onClick={() => remove(index)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2 text-red-500 rounded-full hover:bg-red-50"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </motion.button>
                                    )}
                                </motion.div>
                            ))}
                            <motion.button
                                type="button"
                                onClick={() => append({ id: '', value: '' })}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center text-sm text-[#71BE63] font-medium mt-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add another social link
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Form Actions */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4"
                    >
                        <motion.button
                            type="button"
                            onClick={() => navigate('/dashboard/posts')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            disabled={updateStatus === 'loading'}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-6 py-2 rounded-lg font-medium text-white ${updateStatus === 'loading' ? 'bg-[#71BE63]/70' : 'bg-[#71BE63] hover:bg-[#5fa955]'} transition-colors`}
                        >
                            {updateStatus === 'loading' ? (
                                <span className="flex items-center justify-center">
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                    ></motion.span>
                                    Updating...
                                </span>
                            ) : (
                                'Update Brand'
                            )}
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default UpdatePostPage;