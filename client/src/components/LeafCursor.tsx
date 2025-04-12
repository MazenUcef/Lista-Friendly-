import { useEffect, useState } from 'react';
import leafCursor from '../assets/images/leaves.png';

const LeafCursor = () => {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseEnter = () => setHidden(false);
        const handleMouseLeave = () => setHidden(true);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseenter', handleMouseEnter);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            className={`fixed pointer-events-none z-50 transition-transform duration-100 ${hidden ? 'opacity-0' : 'opacity-100'}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)',
            }}
        >
            <img
                src={leafCursor}
                alt="leaf cursor"
                className="w-8 h-8"
            />
        </div>
    );
};

export default LeafCursor;