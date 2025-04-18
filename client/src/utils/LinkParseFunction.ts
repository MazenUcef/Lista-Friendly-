// src/utils/parseSocialLinks.ts
export const parseSocialLinks = (socialLinks: string[]): string[] => {
    if (!socialLinks || socialLinks.length === 0) return [];
    
    // Handle the case where socialLinks is a stringified array
    if (socialLinks.length === 1 && socialLinks[0].startsWith('[')) {
        try {
            const parsed = JSON.parse(socialLinks[0]);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
            return socialLinks;
        }
    }
    
    return socialLinks;
};