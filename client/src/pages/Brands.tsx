import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import BrandCard from '../components/BrandCard';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import { useReadPosts } from '../api/postsApi';
import { toast } from 'react-hot-toast';
import { Post } from '../redux/postSlice';
import { useSearchParams } from 'react-router';
import { CATEGORIES } from '../constants';

const Brands = () => {
    const { posts, readStatus, readError, fetchPosts } = useReadPosts();
    const [filteredBrands, setFilteredBrands] = useState<Post[]>([]);
    const [searchTerm, setSearchTerm] = useState('');


    const favorites: string[] = [];
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);


    const [searchParams] = useSearchParams();
    const urlCategory = searchParams.get('category');


    useEffect(() => {
        if (urlCategory) {
            setSelectedCategory(urlCategory);
        } else {
            setSelectedCategory('All');
        }
    }, [urlCategory]);



    useEffect(() => {
        fetchPosts({
            limit: 100,
            order: 'desc'
        });
    }, []);

    useEffect(() => {
        if (readError) {
            toast.error(readError);
        }
    }, [readError]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);



    // Filter by search term and category
    const applyFilters = () => {
        if (!posts) return;

        let results = [...posts];

        if (searchTerm) {
            results = results.filter(brand =>
                brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                brand.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (brand.location && brand.location.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (selectedCategory !== 'All') {
            results = results.filter(brand => brand.category === selectedCategory);
        }

        setFilteredBrands(results);
    };

    useEffect(() => {
        if (posts) {
            applyFilters();
        }
    }, [searchTerm, selectedCategory, posts]);

    if (readStatus === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[#71BE63]"
                ></motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#71BE63] mb-4">Discover Eco-Friendly Brands</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore our collection of sustainable brands making a positive impact
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search brands..."
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#71BE63] focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Dropdown for category selection */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            id="dropdownDefaultButton"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center justify-between w-full md:w-44 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#71BE63]"
                            type="button"
                        >
                            {selectedCategory}
                            <FaChevronDown className={`ml-2 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown menu */}
                        {dropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                id="dropdown"
                                className="z-10 absolute mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
                            >
                                <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
                                    {CATEGORIES.map(category => (
                                        <li key={category}>
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setDropdownOpen(false);
                                                }}
                                                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedCategory === category ? 'bg-green-50 text-[#71BE63]' : ''}`}
                                            >
                                                {category}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </div>
                </div>

                {filteredBrands.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-medium text-gray-700">No brands found</h3>
                        <p className="mt-2 text-gray-500">Try adjusting your search or category filter</p>
                    </div>
                ) : (
                    <BrandCard
                        filteredBrands={filteredBrands}
                    />
                )}

                {/* Favorites section */}
                {favorites.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-[#71BE63] mb-6">Your Favorite Brands</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBrands
                                .filter(brand => favorites.includes(brand._id))
                                .map(brand => (
                                    <motion.div
                                        key={`fav-${brand._id}`}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-lg shadow-md p-4 flex items-center hover:shadow-lg transition-shadow"
                                    >
                                        <img
                                            src={brand.brandPicture || 'https://via.placeholder.com/150'}
                                            alt={brand.name}
                                            className="w-16 h-16 rounded-full object-cover mr-4"
                                        />
                                        <div>
                                            <h3 className="font-medium text-gray-900">{brand.name}</h3>
                                            <p className="text-sm text-gray-500">{brand.category}</p>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Brands;