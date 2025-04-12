import { useState } from 'react';
import { motion } from 'framer-motion';
import banner from '../assets/images/bannerSignup.png';
import signupimage from '../assets/images/signupimage.png';
import { useNavigate } from 'react-router';
import earthPlanet from '../assets/images/earthPlanet.png';
import greentree from '../assets/images/greentree.png';
import whitetree from '../assets/images/whitetree.png';

const SignUpSection = () => {
    const [email, setEmail] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/signup', { state: email });
        setEmail('');
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: 'easeInOut',
            },
        },
    };

    const slideInVariants = {
        hidden: { x: -50, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: 'backOut',
            },
        },
    };

    const fadeUpVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    const fadeInVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <motion.div
            className="relative mx-auto w-full mt-8 py-20 md:mt-16 flex justify-center items-center bg-no-repeat bg-cover bg-center rounded-sm"
            style={{ backgroundImage: `url(${banner})` }}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Background overlay with opacity */}
            <motion.div
                className="absolute inset-0 bg-black opacity-60 rounded-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 1 }}
            />

            {/* Main content container */}
            <motion.div
                className="relative bg-white w-full max-w-[90%] sm:max-w-[21.875rem] md:max-w-[58.125rem] mx-auto rounded-3xl overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <motion.div
                        className="w-full md:w-[22.5rem] h-[18.236rem] md:h-auto"
                        variants={slideInVariants}
                    >
                        <img
                            src={signupimage}
                            alt="signupimage"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Text and Form Section */}
                    <motion.div
                        className="w-full flex flex-col justify-center items-center px-4 py-6 md:py-0 md:px-8"
                        variants={fadeUpVariants}
                    >
                        <motion.h1
                            className="text-[14px] sm:text-[18px] md:text-[24px] font-bold text-center"
                            whileHover={{ scale: 1.03 }}
                        >
                            Subscribe to our Newsletter
                        </motion.h1>

                        <motion.p
                            className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-center mt-3 md:mt-5"
                            variants={fadeUpVariants}
                        >
                            Join our green community and receive exclusive offers, Sign up Now!!!
                        </motion.p>

                        <form
                            className="w-full flex flex-col items-center"
                            onSubmit={handleSubmit}
                        >
                            <motion.div
                                className="my-6 w-full max-w-[20rem]"
                                variants={fadeUpVariants}
                            >
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    id="email"
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-[#71BE63] focus:border-transparent"
                                    placeholder="Enter your email"
                                    required
                                />
                            </motion.div>

                            <motion.button
                                type="submit"
                                className="text-[14px] sm:text-[16px] hover:bg-gray-700 border-b-4 border-black text-white rounded-lg bg-[#71BE63] py-2 px-6 sm:px-7 font-extrabold"
                                variants={fadeUpVariants}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Sign Up Now
                            </motion.button>
                        </form>
                    </motion.div>
                </div>

                {/* Decorative Images (visible only on larger screens) */}
                <motion.div
                    className="absolute hidden lg:flex right-[-8rem] bottom-[-8rem]"
                    variants={fadeInVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 2 }}
                >
                    <img src={earthPlanet} alt="Earth Planet" className="w-32 h-32" />
                </motion.div>
                <motion.div
                    className="absolute hidden lg:flex left-[-8rem] bottom-0"
                    variants={fadeInVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 2 }}
                >
                    <img src={greentree} alt="Green Tree" className="w-32 h-32" />
                </motion.div>
                <motion.div
                    className="absolute hidden lg:flex right-[-8rem] top-[-4rem]"
                    variants={fadeInVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 2 }}
                >
                    <img src={whitetree} alt="White Tree" className="w-32 h-32" />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default SignUpSection;