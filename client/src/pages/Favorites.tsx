import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaFacebook, FaHeart, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaSearch, FaTimes, FaTwitter, FaYoutube } from 'react-icons/fa';
import EmptyState from '../components/EmptyState';
import { useReadFavorites, useToggleFavorite } from '../api/favoriteApi';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const FavoritesPage = () => {
  const { favorites = [], fetchFavorites, readStatus } = useReadFavorites(); // Default empty array
  const { toggleFavoritePost } = useToggleFavorite();
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchFavorites({ limit: 20 });
    }
  }, [user]);

  const filteredFavorites = (favorites || []).filter(favorite =>
    favorite && // Check if favorite exists
    (favorite.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      favorite.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const hoverEffect = {
    scale: 1.03,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  };

  const tapEffect = {
    scale: 0.98,
    transition: {
      duration: 0.2
    }
  };
  if (readStatus === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 rounded-full border-t-2 border-b-2 border-[#71BE63]"
        />
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        description={searchTerm ?
          "No matches found for your search" :
          "Brands you favorite will appear here"}
        icon={<FaHeart className="text-4xl text-[#71BE63]" />}
      >
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 px-4 py-2 bg-[#71BE63] text-white rounded-lg hover:bg-[#5aa34a] transition"
          >
            Clear search
          </button>
        )}
      </EmptyState>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-[#71BE63] mb-2">Your Favorite Brands</h1>
          <p className="text-lg text-gray-600">
            {favorites.length} {favorites.length === 1 ? 'brand' : 'brands'} saved
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-md mx-auto mb-12"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search your favorites..."
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#71BE63] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FaTimes className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </motion.div>

        {/* Favorites Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredFavorites.map((favorite) => (
            <motion.div
              key={favorite._id}
              variants={item}
              whileHover={hoverEffect}
              whileTap={tapEffect}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Brand Image */}
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  src={favorite.brandPicture || 'https://via.placeholder.com/400'}
                  alt={favorite.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={async() => {
                    await toggleFavoritePost(favorite._id)
                    fetchFavorites({ limit: 20 });
                  }}
                  className="absolute top-4 cursor-pointer right-4 bg-white p-2 rounded-full shadow-md"
                  aria-label="Remove from favorites"
                >
                  <FaHeart className="text-red-500 text-xl" />
                </motion.button>
              </div>

              {/* Brand Info */}
              <div className="p-6">
                <motion.h3
                  className="text-xl font-bold text-gray-900 mb-2"
                  whileHover={{ color: '#71BE63' }}
                >
                  {favorite.name}
                </motion.h3>

                <div className="flex items-center text-gray-600 mb-3">
                  <FaMapMarkerAlt className="mr-2 text-[#71BE63]" />
                  <span>{favorite.location}</span>
                </div>

                <motion.p
                  className="text-gray-600 mb-4 line-clamp-2"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {favorite.description}
                </motion.p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <motion.span
                    className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                    whileHover={{ scale: 1.05 }}
                  >
                    {favorite.category}
                  </motion.span>
                </div>

                {/* Social Links */}
                {favorite.socialLinks && favorite.socialLinks.length > 0 && (
                  <div className="flex space-x-3">
                    {favorite.socialLinks.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -2 }}
                        className="text-gray-500 hover:text-[#71BE63] transition"
                      >
                        {link.includes('instagram') && <FaInstagram className="text-xl" />}
                        {link.includes('twitter') && <FaTwitter className="text-xl" />}
                        {link.includes('facebook') && <FaFacebook className="text-xl" />}
                        {link.includes('linkedin') && <FaLinkedin className="text-xl" />}
                        {link.includes('youtube') && <FaYoutube className="text-xl" />}
                      </motion.a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FavoritesPage;