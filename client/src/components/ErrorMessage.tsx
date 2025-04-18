import { motion } from 'framer-motion';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto mt-8"
        >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{message}</span>
        </motion.div>
    );
};

export default ErrorMessage;