import { motion } from "framer-motion";
import { Link } from "react-router";
import leaves from '../assets/images/LeavesLeft.png';
import { useReadPosts } from '../api/postsApi';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import BrandCard from './BrandCard';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const BrandsSection = () => {
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
    
    const fadeInVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeInOut"
            }
        }
    };

    const titleVariants = {
        hidden: { y: -20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    // Use the read posts hook
    const { posts, readStatus, readError, fetchPosts } = useReadPosts();
    const { favorites } = useSelector((state: RootState) => state.fav);

    // Extract just the post IDs from favorites
    const favoritePostIds = favorites?.map(fav => fav._id) || [];

    useEffect(() => {
        // Fetch posts when component mounts
        fetchPosts({
            limit: 6, // Only fetch 6 posts for this section
            order: 'desc'
        });
    }, []);

    useEffect(() => {
        if (readError) {
            toast.error(readError);
        }
    }, [readError]);

    return (
        <motion.div
            className='relative flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8'
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
        >
            {/* Title */}
            <motion.div 
                variants={titleVariants}
                className="text-center w-full"
            >
                <h1 className='text-3xl md:text-[36px] font-extrabold mb-12'>Our Best-Selling Brands</h1>
            </motion.div>

            {/* Loading state */}
            {readStatus === 'loading' && (
                <div className="flex justify-center items-center h-64">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[#71BE63]"
                    ></motion.div>
                </div>
            )}

            {/* Brands Grid */}
            {readStatus === 'succeeded' && posts && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto z-55"
                >
                    <BrandCard 
                        filteredBrands={posts.slice(0, 6)} 
                        favorites={favoritePostIds} 
                    />
                </motion.div>
            )}

            {/* Empty state */}
            {readStatus === 'succeeded' && (!posts || posts.length === 0) && (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600">No brands found</p>
                </div>
            )}

            {/* Explore More Button */}
            <motion.div 
                variants={titleVariants}
                className="mt-16 text-center"
            >
                <Link 
                    to="/brands" 
                    className='text-[16px] hover:bg-gray-700 border-b-4 border-[#71BE63] text-white rounded-lg bg-black py-2 px-7 font-extrabold inline-block'
                >
                    EXPLORE MORE
                </Link>
            </motion.div>

            {/* Decorative Leaves */}
            <motion.div
                className='absolute hidden md:flex left-0 bottom-0'
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.5 }}
            >
                <img
                    src={leaves}
                    alt='leaves'
                    className="w-auto"
                />
            </motion.div>
        </motion.div>
    )
}

export default BrandsSection;