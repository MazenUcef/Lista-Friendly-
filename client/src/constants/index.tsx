export const CATEGORIES = [
    'All',
    'Fashion',
    'Food',
    'Home Goods',
    'Personal Care',
    'Other'
] as const;

export type Category = typeof CATEGORIES[number];