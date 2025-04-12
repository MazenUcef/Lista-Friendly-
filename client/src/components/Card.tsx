import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { useState } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"

interface Props {
    src?: string
    desc?: string
    name?: string
    socials?: string[]
    index?: number
}

const Card = ({ src, desc, name, socials = [], index = 0 }: Props) => {
    const [rating, setRating] = useState(4)
    
    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.1
            }
        },
        hover: {
            y: -5,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
        }
    }

    const imageVariants = {
        hover: {
            scale: 1.03,
            transition: { duration: 0.3 }
        }
    }

    const buttonVariants = {
        hover: {
            scale: 1.05,
            backgroundColor: "#71BE00",
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.95
        }
    }

    return (
        <motion.div 
            className="w-full mb-16 max-w-sm bg-white rounded-lg dark:bg-gray-800 overflow-hidden"
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={cardVariants}
        >
            <Link to="#">
                <motion.img 
                    className="w-full h-[28.125rem] rounded-lg object-cover" 
                    src={src} 
                    alt="product image"
                    variants={imageVariants}
                    whileHover="hover"
                />
            </Link>
            
            <div className="px-5 pb-5">
                <Link className='mt-5 block' to="#">
                    <motion.h5 
                        className="text-[24px] font-semibold text-black"
                        whileHover={{ color: "#71BE63" }}
                    >
                        {name}
                    </motion.h5>
                </Link>
                
                <motion.div whileHover={{ x: 2 }}>
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        {desc}
                    </h5>
                </motion.div>
                
                <div className="flex items-center mt-2.5 mb-5">
                    <Rating 
                        style={{ maxWidth: 150 }} 
                        value={rating} 
                        onChange={setRating} 
                        itemStyles={{
                            itemShapes: (
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            ),
                            activeFillColor: '#FFD700',
                            inactiveFillColor: '#E5E7EB'
                        }}
                    />
                    <motion.span 
                        className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3"
                        whileHover={{ scale: 1.1 }}
                    >
                        {rating}.0
                    </motion.span>
                </div>
                
                <div className="flex items-center justify-center">
                    {socials?.length > 0 && (
                        <motion.div 
                            className="flex items-center space-x-3 rtl:space-x-reverse"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {socials.map((social, i) => (
                                <Link to="#" key={i} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                    <motion.img 
                                        src={social} 
                                        alt="social icon" 
                                        className="w-5 h-5"
                                        whileHover={{ scale: 1.2 }}
                                    />
                                </Link>
                            ))}
                        </motion.div>
                    )}
                    
                    <motion.div className="ml-4">
                        <Link to="#">
                            <motion.button
                                className="w-[9.313rem] cursor-pointer h-[2.625rem] flex justify-center items-center rounded-lg text-white font-extrabold bg-[#71BE63]"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                Add to fav
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

export default Card