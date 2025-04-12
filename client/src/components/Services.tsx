import { motion } from "framer-motion";
import products from '../assets/images/products.png';
import choices from '../assets/images/choices.png';
import quality from '../assets/images/quality.png';
import packaging from '../assets/images/packaging.png';
import leaves from '../assets/images/leaves.png';
import ButterFly from '../assets/images/butterFly.png';

const Services = () => {
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
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
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

    const serviceItems = [
        {
            img: products,
            title: "Sustainable Products",
            description: "Explore our carefully curated selection of sustainable products, each designed to reduce your carbon footprint"
        },
        {
            img: choices,
            title: "Eco-Friendly Choices",
            description: "Make conscious choices with our eco-friendly products, knowing that your purchases promote ethical sourcing and responsible manufacturing practices."
        },
        {
            img: quality,
            title: "High-Quality Selection",
            description: "Invest in long-lasting and reliable products that meet our stringent quality standards, ensuring your satisfaction and the longevity of your purchases."
        },
        {
            img: packaging,
            title: "Sustainable Packaging",
            description: "Our sustainable packaging ensures that your orders arrive safely while minimizing their impact on the planet."
        }
    ];

    return (
        <motion.div 
            className='flex relative justify-center flex-col mt-16 items-center'
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Title */}
            <motion.div variants={itemVariants}>
                <h1 className='text-3xl md:text-[36px] font-extrabold'>
                    Why Choose <span className="text-[#71BE63] font-extrabold">Friendly</span> ليسته ?
                </h1>
            </motion.div>

            {/* Services Grid */}
            <motion.div 
                className="flex flex-wrap justify-around mt-10 items-center w-full gap-8 px-4"
                variants={containerVariants}
            >
                {serviceItems.map((item, index) => (
                    <motion.div 
                        key={index}
                        className='flex flex-col items-center justify-center max-w-[18rem]'
                        variants={itemVariants}
                        custom={index}
                        whileHover={{ y: -5 }}
                    >
                        <motion.div whileHover={{ scale: 1.1 }}>
                            <img
                                src={item.img}
                                alt={item.title.toLowerCase().replace(' ', '-')}
                                className="w-24 h-24 object-contain"
                            />
                        </motion.div>
                        <motion.div>
                            <h1 className='font-extrabold text-lg md:text-[20px] mt-4 text-center'>
                                {item.title}
                            </h1>
                        </motion.div>
                        <motion.div className='w-full px-2'>
                            <p className='text-sm md:text-base font-normal text-center mt-2'>
                                {item.description}
                            </p>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Decorative Elements */}
            <motion.div 
                className='absolute hidden md:flex right-0 top-[16rem]'
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.5 }}
            >
                <img
                    src={leaves}
                    alt='leaves'
                    className=""
                />
            </motion.div>
            
            <motion.div 
                className='absolute hidden md:flex left-0 top-[30rem]'
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 2 }}
            >
                <img
                    src={ButterFly}
                    alt='ButterFly'
                    className=""
                />
            </motion.div>
        </motion.div>
    )
}

export default Services;