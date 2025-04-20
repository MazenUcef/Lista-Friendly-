import { motion } from 'framer-motion';
import { useState } from 'react';

interface StarRatingProps {
    value: number;
    onChange?: (value: number) => void;
    interactive?: boolean;
    showScore?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const StarRating = ({
    value,
    onChange,
    interactive = false,
    showScore = false,
    size = 'md'
}: StarRatingProps) => {
    const [hoverValue, setHoverValue] = useState(0);

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    const handleClick = (starValue: number) => {
        if (interactive && onChange) {
            onChange(starValue);
        }
    };

    const StarIcon = ({ filled, starValue }: { filled: boolean; starValue: number }) => (
        <motion.svg
            className={`${sizeClasses[size]} ${filled ? 'text-yellow-300' : 'text-gray-300'} me-1 cursor-pointer`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
            whileHover={interactive ? { scale: 1.2 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            onMouseEnter={interactive ? () => setHoverValue(starValue) : undefined}
            onMouseLeave={interactive ? () => setHoverValue(0) : undefined}
            onClick={() => handleClick(starValue)}
        >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </motion.svg>
    );

    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                    key={star}
                    filled={star <= (hoverValue || value)}
                    starValue={star}
                />
            ))}

            {showScore && (
                <>
                    <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {value.toFixed(1)}
                    </p>
                    <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        out of
                    </p>
                    <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        5
                    </p>
                </>
            )}
        </div>
    );
};

export default StarRating;