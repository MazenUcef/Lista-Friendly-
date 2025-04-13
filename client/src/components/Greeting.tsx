import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import banner from '../assets/images/BannerCover.png';
import WoodContainer from '../assets/images/WoodContainer.png';
import WoodPlate from '../assets/images/WoodPlate.png';
import OrderBag from '../assets/images/OrderBag.png';
import GreenOrderBag from '../assets/images/GreenOrderBag.png';
import ButterFly from '../assets/images/butterFly.png';
import WhiteButterFly from '../assets/images/WhiteButterFly.png';
import lamp from '../assets/images/lamp.png';

const Greeting = () => {
    const motionImages = [
        WoodContainer,
        WoodPlate,
        OrderBag,
        GreenOrderBag
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === motionImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [motionImages.length]);

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

    const leftItemVariants = {
        hidden: { x: -50, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const rightItemVariants = {
        hidden: { x: 50, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const twistVariants = {
        initial: { rotateY: 90, opacity: 0, scale: 0.8 },
        animate: {
            rotateY: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        },
        exit: {
            rotateY: -90,
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.8, ease: "easeIn" }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const fadeInUp = {
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

    return (
        <motion.div
            className="flex flex-wrap mt-10 md:mt-16 justify-around"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Left Section: Text Content */}
            <motion.div
                className="flex flex-col relative items-center md:items-start"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="w-full hidden md:flex justify-end" variants={fadeInUp}>
                    <img
                        src={ButterFly}
                        alt="Butterfly"
                    />
                </motion.div>

                <motion.div variants={leftItemVariants}>
                    <h1 className="bold text-[28.31px] md:text-[48px]">Welcome to <span className="text-[#71BE63] font-extrabold">Friendly</span> <span className="text-black bold">ليسته</span></h1>
                </motion.div>

                <motion.div className="mt-5" variants={leftItemVariants}>
                    <h1 className="regular text-[32px] md:text-[40px]">Your Sustainable </h1>
                </motion.div>

                <motion.div className="md:mt-5 flex items-center md:items-start gap-1 md:flex-col" variants={leftItemVariants}>
                    <h1 className="font-extrabold text-[#71BE63] text-[28.31px] md:text-[48px]">Shopping</h1>
                    <h1 className="font-extrabold md:mt-3 text-[#71BE63] text-[28.31px] md:text-[48px]">Destination</h1>
                </motion.div>

                <motion.div className="mt-5" variants={leftItemVariants}>
                    <p className="regular text-[14px] md:text-[16px]">"Discover Sustainability. Embrace <span className="text-[#71BE63] bold">Friendly</span> <span className="text-black bold">ليسته</span>.<br />
                        Your Eco-Friendly Haven for Conscious Shopping."</p>
                </motion.div>

                <motion.div className="w-full hidden md:flex justify-center mt-5" variants={fadeInUp}>
                    <img
                        src={ButterFly}
                        alt="Butterfly"
                        className="w-13 h-13"
                    />
                </motion.div>

                <motion.div variants={leftItemVariants}>
                    <motion.button
                        className="w-[10rem] mt-10 md:mt-0 cursor-pointer hover:bg-[#71BE10] text-[16px] font-extrabold text-white h-[2.625rem] bg-[#71BE63] rounded-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Shop Now
                    </motion.button>
                </motion.div>

                <motion.div className="w-full flex md:hidden justify-end mt-5" variants={fadeInUp}>
                    <img
                        src={ButterFly}
                        alt="Butterfly"
                        className="w-13 h-13"
                    />
                </motion.div>
                <motion.div className="w-full flex md:hidden justify-start" variants={fadeInUp}>
                    <img
                        src={WhiteButterFly}
                        alt="Butterfly"
                    />
                </motion.div>

                <motion.div className="mt-16 absolute top-[35rem] hidden xl:flex" variants={fadeInUp}>
                    <img
                        src={lamp}
                        alt="lamp"
                        className=""
                    />
                </motion.div>
            </motion.div>

            {/* Right Section: Image */}
            <motion.div
                className=""
                variants={rightItemVariants}
            >
                <div className='w-[22rem] md:w-[38.313rem] h-[45.813rem] md:h-[42.625rem] bg-no-repeat relative'
                    style={{ backgroundImage: `url(${banner})` }}>

                    <div className="absolute inset-0 flex items-center justify-center perspective-1000">
                        <motion.div
                            key={currentImageIndex}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={twistVariants}
                            className="w-full h-full flex items-center justify-center"
                        >
                            <motion.img
                                src={motionImages[currentImageIndex]}
                                alt="Product showcase"
                                className="object-contain flex justify-center items-center ml-5 md:ml-0 w-[19rem]"
                                whileHover={{ scale: 1.05 }}
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Greeting;