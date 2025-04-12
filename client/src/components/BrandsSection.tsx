import { motion } from "framer-motion";
import Card from './Card';
import comp1 from '../assets/images/comp1.jpg';
import comp2 from '../assets/images/comp2.jpg';
import comp3 from '../assets/images/comp3.jpg';
import comp4 from '../assets/images/comp4.jpg';
import comp5 from '../assets/images/comp5.jpg';
import comp6 from '../assets/images/comp6.jpg';
import { Link } from "react-router";
import leaves from '../assets/images/LeavesLeft.png';

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
    
    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        },
        hover: {
            y: -10,
            transition: { duration: 0.2 }
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

    const brands = [
        { src: comp1, name: "Brand 1", desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, accusantium." },
        { src: comp2, name: "Brand 2", desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, accusantium." },
        { src: comp3, name: "Brand 3", desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, accusantium." },
        { src: comp4, name: "Brand 4", desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, accusantium." },
        { src: comp5, name: "Brand 5", desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, accusantium." },
        { src: comp6, name: "Brand 6", desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, accusantium." }
    ];

    return (
        <motion.div
            className='w-full relative flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8' // Added padding classes
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
        >
            {/* Title */}
            <motion.div 
                variants={titleVariants}
                className="text-center w-full" // Added text-center and w-full
            >
                <h1 className='text-3xl md:text-[36px] font-extrabold mb-12'>Our Best-Selling Brands</h1>
            </motion.div>

            {/* Brands Grid */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl" // Changed to grid layout
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {brands.map((brand, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover="hover"
                        className="flex justify-center" // Centering each card
                    >
                        <Card
                            src={brand.src}
                            desc={brand.desc}
                            name={brand.name}
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* Explore More Button */}
            <motion.div 
                variants={titleVariants}
                className="mt-16 text-center" // Added mt-16 for spacing
            >
                <Link 
                    to="#" 
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