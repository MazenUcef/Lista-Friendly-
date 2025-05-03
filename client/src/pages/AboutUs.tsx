import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const AboutUs = () => {
    const navigate = useNavigate()
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
            },
        },
    };

    const leafVariants = {
        float: {
            y: [-10, 10, -10],
            rotate: [-5, 5, -5],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16 px-4 sm:px-6 lg:px-8">
            {/* Animated Leaves Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-green-200 text-4xl"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        variants={leafVariants}
                        animate="float"
                    >
                        {i % 2 === 0 ? "🍃" : "🌱"}
                    </motion.div>
                ))}
            </div>

            <motion.div
                className="max-w-4xl mx-auto relative"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header Section */}
                <motion.div
                    className="text-center mb-16"
                    variants={itemVariants}
                >
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold text-green-800 mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        About <span className="text-green-600">ListaFriendly</span>
                    </motion.h1>

                    <motion.div
                        className="w-24 h-2 bg-green-400 mx-auto rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    />
                </motion.div>

                {/* Mission Section */}
                <motion.div
                    className="bg-white rounded-2xl shadow-lg p-8 mb-12"
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.h2
                        className="text-2xl font-semibold text-green-700 mb-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        Our Mission
                    </motion.h2>
                    <motion.p
                        className="text-gray-700 text-lg leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        At ListaFriendly, we believe that living sustainably should be simple, accessible, and fun.
                        Our mission is to help people in Egypt make eco-friendly choices part of their daily
                        lives—without the pressure or confusion.
                    </motion.p>
                </motion.div>

                {/* Approach Section */}
                <motion.div
                    className="grid md:grid-cols-2 gap-8 mb-12"
                    variants={containerVariants}
                    whileInView="visible"
                    initial="hidden"
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="bg-green-100 rounded-2xl p-8"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                    >
                        <motion.h3
                            className="text-xl font-semibold text-green-800 mb-4 flex items-center"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <span className="mr-2">🌍</span> Our Approach
                        </motion.h3>
                        <motion.p
                            className="text-gray-700"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            Through creative campaigns, community events, and trustworthy content, we introduce
                            practical ways to reduce waste, support local eco brands, and build a greener future
                            together.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="bg-green-50 rounded-2xl p-8"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                    >
                        <motion.h3
                            className="text-xl font-semibold text-green-800 mb-4 flex items-center"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <span className="mr-2">💚</span> Your Journey
                        </motion.h3>
                        <motion.p
                            className="text-gray-700"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            viewport={{ once: true }}
                        >
                            Whether you're just getting started or already living the green life, ListaFriendly is
                            your go-to space for inspiration, tips, and real change.
                        </motion.p>
                    </motion.div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                >
                    <motion.p
                        className="text-xl text-green-700 mb-6"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                    >
                        Join us in creating a greener Egypt!
                    </motion.p>
                    <motion.button
                        onClick={() => {
                            navigate('/signup')
                        }}
                        className="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-medium py-3 px-8 rounded-full shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Get Started
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AboutUs;