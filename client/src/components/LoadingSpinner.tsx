import { motion } from 'framer-motion';

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center h-56 max-w-sm bg-gray-100 dark:bg-gray-800 rounded-lg">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
            />
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default LoadingSpinner;
