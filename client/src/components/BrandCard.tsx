import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Post } from '../redux/postSlice';
import { useReadFavorites, useToggleFavorite } from '../api/favoriteApi';
import { useState } from 'react';
import SocialMediaIcons from './SocialMediaIcons';
import { useNavigate } from 'react-router';

interface BrandCardProps {
    filteredBrands: Post[];
    favorites: string[];
}

const BrandCard = ({ filteredBrands }: BrandCardProps) => {
    const { toggleFavoritePost } = useToggleFavorite();
    const { fetchFavorites } = useReadFavorites();
    const [loadingPostId, setLoadingPostId] = useState<string | null>(null);
    const [likedBrands, setLikedBrands] = useState<Record<string, boolean>>({});
    const navigate = useNavigate()

    const handleToggleFavorite = async (id: string) => {
        try {
            setLoadingPostId(id);
            await toggleFavoritePost(id);
            // Fetch the updated favorites list after toggling
            await fetchFavorites()
            setLikedBrands(prev => ({
                ...prev,
                [id]: !prev[id] // Toggle the liked state for this specific brand
            }));
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setLoadingPostId(null);
        }
    };


    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            {filteredBrands.map((brand) => {
                // Determine if the brand is favorited (from Redux) or locally liked
                const isFavorite = likedBrands[brand._id];

                return (
                    <motion.div
                        key={brand._id}
                        variants={item}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <img
                                src={brand.brandPicture}
                                alt={brand.name}
                                className="w-full h-full object-cover"
                            />
                            <motion.button
                                onClick={() => handleToggleFavorite(brand._id)}
                                className="absolute top-4 right-4 p-2 bg-white cursor-pointer bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition"
                                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                disabled={loadingPostId === brand._id}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {loadingPostId === brand._id ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-t-2 border-b-2 border-[#71BE63] rounded-full"
                                    />
                                ) : isFavorite ? (
                                    <FaHeart className="text-red-500 text-xl" />
                                ) : (
                                    <FaRegHeart className="text-gray-600 text-xl hover:text-red-500" />
                                )}
                            </motion.button>
                            <span className="absolute bottom-4 left-4 bg-[#71BE63] text-white text-sm px-3 py-1 rounded-full">
                                {brand.category}
                            </span>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-bold text-gray-900">{brand.name}</h2>
                                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                    {brand.location}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-3">{brand.description}</p>
                            <SocialMediaIcons links={brand.socialLinks} />
                            <button
                                onClick={() => {
                                    navigate(`/brand-details/${brand._id}`, { state: brand._id })
                                }}
                                className="mt-6 w-full cursor-pointer bg-[#71BE63] hover:bg-[#5aa34a] text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                                View Brand
                            </button>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default BrandCard;