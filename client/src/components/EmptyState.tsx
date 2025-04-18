// src/components/EmptyState.tsx
import { motion } from 'framer-motion';

interface EmptyStateProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    children?: React.ReactNode;
}

const EmptyState = ({ title, description, icon, children }: EmptyStateProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-[60vh] text-center"
        >
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mb-6"
            >
                {icon}
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">{description}</p>
            {children}
        </motion.div>
    );
};

export default EmptyState;