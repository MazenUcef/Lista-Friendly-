import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router';
import { FaHeart, FaRegHeart, FaArrowLeft } from 'react-icons/fa';
import { useReadPosts } from '../api/postsApi';
import { useToggleFavorite, useReadFavorites } from '../api/favoriteApi';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import SocialMediaIcons from '../components/SocialMediaIcons';
import { Post } from '../redux/postSlice';

const BrandDetails = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { posts, readStatus, readError, fetchPosts } = useReadPosts();
    const { toggleFavoritePost } = useToggleFavorite();
    const { fetchFavorites } = useReadFavorites();
    const [loading, setLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [brand, setBrand] = useState<Post | null>(null);

    // Fetch brand details
    useEffect(() => {
        if (postId) {
            fetchPosts({ postId });
        }
    }, [postId]);

    // Set brand when posts are loaded
    useEffect(() => {
        if (posts && posts.length > 0) {
            setBrand(posts[0]);
        }
    }, [posts]);

    // Handle favorite toggle
    const handleToggleFavorite = async () => {
        try {
            setLoading(true);
            if (!postId) return;
            await toggleFavoritePost(postId);
            await fetchFavorites();
            setIsFavorite(!isFavorite);
        } catch (error) {
            toast.error('Failed to update favorites');
        } finally {
            setLoading(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    if (readStatus === 'loading') {
        return (
            <div className="flex justify-center items-center h-screen">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[#71BE63]"
                ></motion.div>
            </div>
        );
    }

    if (readError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">{readError}</p>
            </div>
        );
    }

    if (!brand) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Brand not found</p>
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <motion.button
                    onClick={() => navigate(-1)}
                    className="flex items-center cursor-pointer text-[#71BE63] mb-6"
                    variants={itemVariants}
                    whileHover={{ x: -5 }}
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Brands
                </motion.button>

                {/* Brand Card */}
                <motion.div
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                    variants={itemVariants}
                >
                    <div className="relative h-96">
                        <img
                            src={brand.brandPicture}
                            alt={brand.name}
                            className="w-full h-full object-cover"
                        />
                        <motion.button
                            onClick={handleToggleFavorite}
                            className="absolute top-4 right-4 p-3 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={loading}
                        >
                            {loading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-t-2 border-b-2 border-[#71BE63] rounded-full"
                                />
                            ) : isFavorite ? (
                                <FaHeart className="text-red-500 text-2xl" />
                            ) : (
                                <FaRegHeart className="text-gray-600 text-2xl hover:text-red-500" />
                            )}
                        </motion.button>
                    </div>

                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <motion.h1
                                className="text-3xl font-bold text-gray-900"
                                variants={itemVariants}
                            >
                                {brand.name}
                            </motion.h1>
                            <motion.span
                                className="bg-[#71BE63] text-white text-sm px-3 py-1 rounded-full"
                                variants={itemVariants}
                            >
                                {brand.category}
                            </motion.span>
                        </div>

                        <motion.div
                            className="mb-8"
                            variants={itemVariants}
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
                            <p className="text-gray-600">{brand.location}</p>
                        </motion.div>

                        <motion.div
                            className="mb-8"
                            variants={itemVariants}
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
                            <p className="text-gray-600 whitespace-pre-line">{brand.description}</p>
                        </motion.div>

                        <motion.div
                            className="mb-8"
                            variants={itemVariants}
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Connect</h3>
                            <SocialMediaIcons links={brand.socialLinks} />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default BrandDetails;