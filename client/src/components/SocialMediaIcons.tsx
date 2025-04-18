// src/components/SocialMediaIcons.tsx
import { FaInstagram, FaTwitter, FaFacebook, FaLinkedin, FaYoutube, FaGlobe } from 'react-icons/fa';
import { parseSocialLinks } from '../utils/LinkParseFunction';

interface SocialMediaIconsProps {
    links: string[];
}

const SocialMediaIcons = ({ links }: SocialMediaIconsProps) => {
    const parsedLinks = parseSocialLinks(links);
    
    const getIconForLink = (url: string) => {
        if (!url) return null;
        
        url = url.toLowerCase();
        
        if (url.includes('instagram.com')) return <FaInstagram />;
        if (url.includes('twitter.com') || url.includes('x.com')) return <FaTwitter />;
        if (url.includes('facebook.com')) return <FaFacebook />;
        if (url.includes('linkedin.com')) return <FaLinkedin />;
        if (url.includes('youtube.com')) return <FaYoutube />;
        return <FaGlobe />;
    };

    return (
        <div className="flex gap-2">
            {parsedLinks.map((link, index) => (
                <a 
                    key={index}
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-[#71BE63] text-xl"
                    title={link}
                >
                    {getIconForLink(link)}
                </a>
            ))}
        </div>
    );
};

export default SocialMediaIcons;