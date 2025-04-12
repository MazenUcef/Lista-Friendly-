import { Link } from 'react-router';
import banner from '../assets/images/bond.png';
import TwoLeaves from '../assets/images/TwoLeaves.png';
import Recycle from '../assets/images/Recycle.png';
import butterFly from '../assets/images/butterFly.png';
import { motion } from "framer-motion";

const BondSection = () => {
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
    const textVariants = {
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

    const buttonVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                type: "spring"
            }
        },
        hover: {
            scale: 1.05,
            backgroundColor: "#5FAE55",
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.95
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
    return (
        <div
            className='w-[80rem] h-[46.5rem] mx-auto mt-10 rounded-sm bg-no-repeat relative'
            style={{ backgroundImage: `url(${banner})` }}
        >
            {/* Background overlay with opacity */}
            <div className='absolute inset-0 bg-white opacity-85 rounded-sm'></div>

            {/* Content container (no opacity here) */}
            <div className='relative w-full flex flex-col items-center pt-16 pb-10 h-full rounded-sm'>
                {/* Title */}
                <motion.div
                    variants={titleVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <h1 className='text-3xl md:text-[36px] font-extrabold'>About</h1>
                </motion.div>

                <motion.div className='text-center mt-10 mb-6' variants={textVariants}>
                    <p className='text-[15px] font-medium max-w-2xl mx-auto'>
                        At Friendly List, we believe sustainability should be simple, accessible, and rewarding. Born from a mission to combat misconceptions about eco-friendly living in Egypt, our platform bridges the gap between conscious consumers and verified sustainable products.
                    </p>
                </motion.div>

                {/* Mission */}
                <motion.div className='text-center mt-6 mb-6' variants={textVariants}>
                    <motion.h1 
                        className='text-[20px] font-semibold mb-5'
                        whileHover={{ scale: 1.03 }}
                    >
                        Mission Statement
                    </motion.h1>
                    <p className='text-[15px] font-medium max-w-2xl mx-auto'>
                        "To be the leading platform for sustainable living, providing eco-friendly products and fostering a green community that promotes conscious consumption and environmental responsibility."
                    </p>
                </motion.div>

                {/* Vision */}
                <motion.div className='text-center mt-6 mb-14' variants={textVariants}>
                    <motion.h1 
                        className='text-[20px] font-semibold mb-5'
                        whileHover={{ scale: 1.03 }}
                    >
                        Vision Statement
                    </motion.h1>
                    <p className='text-[15px] font-medium max-w-2xl mx-auto'>
                        To revolutionize everyday shopping by making eco-friendly choices the easiest choice—without compromising affordability, quality, or convenience.
                    </p>
                </motion.div>

                {/* Button */}
                <motion.div variants={buttonVariants}>
                    <Link 
                        to={"#"} 
                        className='text-[16px] hover:bg-gray-700 border-b-4 border-black text-white rounded-lg bg-[#71BE63] py-2 px-7 font-extrabold block'
                    >
                        READ MORE
                    </Link>
                </motion.div>
                <motion.div
                    className='absolute left-3 bottom-[-5rem]'
                    variants={fadeInVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 2 }}
                >
                    <img
                        src={Recycle}
                        alt='ButterFly'
                        className=""
                    />
                </motion.div>
                <motion.div
                    className='absolute right-0 bottom-[-4rem]'
                    variants={fadeInVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 2 }}
                >
                    <img
                        src={TwoLeaves}
                        alt='ButterFly'
                        className=""
                    />
                </motion.div>
                <motion.div
                    className='absolute right-4 top-4'
                    variants={fadeInVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 2 }}
                >
                    <img
                        src={butterFly}
                        alt='ButterFly'
                        className=""
                    />
                </motion.div>
            </div>
        </div>
    )
}

export default BondSection