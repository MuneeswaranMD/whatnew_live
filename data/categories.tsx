import {
    Footprints,
    ShoppingBag,
    Tv,
    Book,
    Gamepad2,
    Warehouse,
    Shirt,
    Gem,
    Music,
    Armchair,
    Palette,
    Zap,
    UtensilsCrossed,
    Bone
} from 'lucide-react';
import { Category } from '../types';
import React from 'react';

// Helper to create React elements for icons to avoid "can't refer to value" errors if necessary,
// but usually in .ts files importing the component is enough if we use TSX or just type as ReactNode.
// We will return objects with component references or elements. 
// Since we are in a .ts file, we need to be careful with JSX if not using .tsx extension.
// Let's use .tsx for this file to be safe with JSX syntax for icons.

export const productCategories: Category[] = [
    {
        id: 'sneakers-streetwear',
        name: 'Sneakers & Streetwear',
        icon: React.createElement(Footprints),
        color: 'bg-orange-100 text-orange-600',
        subcategories: [
            { id: 'all-sneakers-streetwear', name: 'All Sneakers & Streetwear' },
            { id: 'sneakers', name: 'Sneakers' },
            { id: 'streetwear', name: 'Streetwear' },
        ]
    },
    {
        id: 'bags-accessories',
        name: 'Bags & Accessories',
        icon: React.createElement(ShoppingBag),
        color: 'bg-pink-100 text-pink-600',
        subcategories: [
            { id: 'all-bags-accessories', name: 'All Bags & Accessories' },
            { id: 'luxury-bags-accessories', name: 'Luxury Bags & Accessories' },
            { id: 'midrange-fashion-bags', name: 'Midrange & Fashion Bags' },
            { id: 'other-accessories', name: 'Other Accessories' },
        ]
    },
    {
        id: 'electronics',
        name: 'Electronics',
        icon: React.createElement(Tv), // Using Tv as close proxy for generic electronics or Laptop/Smartphone
        color: 'bg-blue-100 text-blue-600',
        subcategories: [
            { id: 'all-electronics', name: 'All Electronics' },
            { id: 'everyday-electronics', name: 'Everyday Electronics' },
            { id: 'deal-hunting', name: 'Deal Hunting' }, // Corrected 'heal hunting' to 'Deal Hunting' based on context usually found, or 'Meal'?- likely Deal. Or 'Head hunting'? 'Heal' seems wrong. User typed "heal hunting". Assuming "Deal Hunting" or "Headphones"? Let's stick possibly to "Deal Hunting" or maybe "Health & Hunting" no, "hunting" is separate. "Heal" -> "Deal"? I'll use "Deal Hunting" as reasonable guess, or just "Heal Hunting" if it's niche? No, likely typo. Let's try "Audio & Headphones"? Or maybe "Health & Beauty" but that's separate. 
            // User input: "heal hunting". 
            // Context: Electronics. 
            // Could be "Headphones"? "Heal" -> "Head". 
            // Could be "Deal Hunting"?
            // Let's go with "Headphones & Audio" as a safe bet for checking updating later? 
            // Wait, "hunting" is in the next word. "Heal Hunting". 
            // Maybe "Seal Hunting"? No.
            // Let's look at "Knives & Hunting" later. 
            // Let's assume it meant "Deal Hunting".
            { id: 'tools', name: 'Tools' },
            { id: 'camera-photography', name: 'Camera & Photography' },
        ]
    },
    {
        id: 'books-movies',
        name: 'Books & Movies',
        icon: React.createElement(Book),
        color: 'bg-yellow-100 text-yellow-600',
        subcategories: [
            { id: 'all-books-movies', name: 'All Books & Movies' },
            { id: 'books', name: 'Books' },
            { id: 'movies', name: 'Movies' },
        ]
    },
    {
        id: 'toys-hobbies',
        name: 'Toys & Hobbies',
        icon: React.createElement(Gamepad2),
        color: 'bg-purple-100 text-purple-600',
        subcategories: [
            { id: 'all-toys-hobbies', name: 'All Toys & Hobbies' },
            { id: 'disney', name: 'Disney' },
            { id: 'dolls', name: 'Dolls' },
            { id: 'starwars', name: 'Star Wars' },
            { id: 'food-toys', name: 'Food Toys' },
        ]
    },
    {
        id: 'estate-sale-storage',
        name: 'Estate Sale & Storage Units',
        icon: React.createElement(Warehouse),
        color: 'bg-stone-100 text-stone-600',
        subcategories: [
            { id: 'all-estate-storage', name: 'All Estate Sale & Storage Units' },
            { id: 'storage-units', name: 'Storage Units' },
            { id: 'estate-sales', name: 'Estate Sales' },
            { id: 'other-estate-storage', name: 'Other Estate Sale & Storage Units' },
            { id: 'garage-sales', name: 'Garage Sales' },
        ]
    },
    {
        id: 'mens-fashion',
        name: "Men's Fashion",
        icon: React.createElement(Shirt),
        color: 'bg-cyan-100 text-cyan-600',
        subcategories: [
            { id: 'all-mens-fashion', name: "All Men's Fashion" },
            { id: 'streetwear-men', name: 'Streetwear' },
            { id: 'mens-vintage', name: "Men's Vintage Clothing" }, // 'wintage' -> 'Vintage'
            { id: 'watches-men', name: 'Watches' },
            { id: 'mens-modern', name: "Men's Modern" },
            { id: 'sports-apparel', name: 'Sports Apparel' },
            { id: 'other-mens-fashion', name: "Other Men's Fashion" },
            { id: 'mens-jewelry', name: "Men's Jewelry" }, // 'jwelry' -> 'Jewelry'
        ]
    },
    {
        id: 'womens-fashion',
        name: "Women's Fashion",
        icon: React.createElement(Shirt), // Reusing Shirt or maybe a Dress icon if available? Shirt is fine for now.
        color: 'bg-rose-100 text-rose-600',
        subcategories: [
            { id: 'all-womens-fashion', name: "All Women's Fashion" },
            { id: 'womens-contemporary', name: "Women's Contemporary" }, // 'contemprory' -> 'Contemporary'
            { id: 'beauty-women', name: 'Beauty' },
            { id: 'bags-accessories-women', name: 'Bags & Accessories' },
            { id: 'womens-activewear', name: "Women's Activewear" },
            { id: 'other-womens-fashion', name: "Other Women's Fashion" },
            { id: 'womens-vintage', name: "Women's Vintage Clothing" },
            { id: 'womens-plus-size', name: "Women's Plus Size" },
            { id: 'womens-shoes', name: "Women's Shoes" },
            { id: 'womens-dresses', name: "Women's Dresses" },
        ]
    },
    {
        id: 'beauty',
        name: 'Beauty',
        icon: React.createElement(Gem), // Or something for makeup
        color: 'bg-red-50 text-red-600',
        subcategories: [
            { id: 'all-beauty', name: 'All Beauty' },
            { id: 'makeup-skincare', name: 'Makeup & Skincare' },
            { id: 'fragrance-perfume', name: 'Fragrance & Perfume' }, // 'frangrance' -> 'Fragrance'
            { id: 'other-beauty', name: 'Other Beauty' },
            { id: 'nails', name: 'Nails' },
            { id: 'hair-products', name: 'Hair Products' },
        ]
    },
    {
        id: 'jewellery',
        name: 'Jewellery',
        icon: React.createElement(Gem),
        color: 'bg-amber-100 text-amber-600',
        subcategories: [
            { id: 'all-jewellery', name: 'All Jewellery' },
            { id: 'fine-precious-metals', name: 'Fine & Precious Metals' },
            { id: 'vintage-antique-jewellery', name: 'Vintage & Antique Jewellery' },
            { id: 'watches-jewellery', name: 'Watches' },
            { id: 'contemporary-costume', name: 'Contemporary Costume' }, // 'contemptory' -> 'Contemporary'
            { id: 'mens-jewellery-cat', name: "Men's Jewellery" },
            { id: 'handcrafted-artisan', name: 'Handcrafted & Artisan Jewellery' },
        ]
    },
    {
        id: 'music',
        name: 'Music',
        icon: React.createElement(Music),
        color: 'bg-indigo-100 text-indigo-600',
        subcategories: [
            { id: 'all-music', name: 'All Music' },
            { id: 'vinyl-records', name: 'Vinyl Records' }, // 'recors' -> 'Records'
            { id: 'cds-cassettes', name: 'CDs & Cassettes' },
            { id: 'instruments-accessories', name: 'Instruments & Accessories' },
            { id: 'other-music', name: 'Other Music' },
        ]
    },
    {
        id: 'video-games',
        name: 'Video Games',
        icon: React.createElement(Gamepad2),
        color: 'bg-violet-100 text-violet-600',
        subcategories: [
            { id: 'all-video-games', name: 'All Video Games' },
            { id: 'retro-games', name: 'Retro Games' },
            { id: 'modern-games', name: 'Modern Games' },
            { id: 'consoles-accessories', name: 'Consoles & Accessories' },
            { id: 'guides-manuals', name: 'Guides, Manuals & Cases' },
        ]
    },
    {
        id: 'antique-vintage-decor',
        name: 'Antique & Vintage Decor',
        icon: React.createElement(Armchair),
        color: 'bg-amber-50 text-amber-700',
        subcategories: [
            { id: 'all-antique-vintage', name: 'All Antique & Vintage Decor' },
            { id: 'vintage-decor', name: 'Vintage Decor' },
            { id: 'antique', name: 'Antique' },
        ]
    },
    {
        id: 'home-garden',
        name: 'Home & Garden',
        icon: React.createElement(Warehouse), // Or Plant icon if available
        color: 'bg-emerald-100 text-emerald-600',
        subcategories: [
            { id: 'all-home-garden', name: 'All Home & Garden' },
            { id: 'tools-home', name: 'Tools' },
            { id: 'hydration', name: 'Hydration' },
            { id: 'holiday-decor', name: 'Holiday Decor' },
            { id: 'other-home-garden', name: 'Other Home & Garden' },
            { id: 'plant-garden', name: 'Plant & Garden' },
            { id: 'candles', name: 'Candles' },
            { id: 'kitchen-dining', name: 'Kitchen & Dining' },
        ]
    },
    {
        id: 'baby-kids',
        name: 'Baby & Kids',
        icon: React.createElement(Gamepad2), // Placeholder, maybe 'Baby' icon not available, using generic toy or smth
        color: 'bg-sky-100 text-sky-600',
        subcategories: []
    },
    {
        id: 'arts-handmade',
        name: 'Arts & Handmade',
        icon: React.createElement(Palette),
        color: 'bg-fuchsia-100 text-fuchsia-600',
        subcategories: [
            { id: 'all-arts-handmade', name: 'All Arts & Handmade' },
            { id: 'craft-supplies', name: 'Craft Supplies' },
            { id: 'rocks-crystals', name: 'Rocks & Crystals' },
            { id: 'handmade-items', name: 'Handmade Items' },
            { id: 'woodworking', name: 'Woodworking' },
        ]
    },
    {
        id: 'comics',
        name: 'Comics',
        icon: React.createElement(Book),
        color: 'bg-red-200 text-red-700',
        subcategories: [
            { id: 'all-comics', name: 'All Comics' },
            { id: 'modern-comics', name: 'Modern Comics' },
            { id: 'vintage-comics', name: 'Vintage Comics' },
        ]
    },
    {
        id: 'knives-hunting',
        name: 'Knives & Hunting',
        icon: React.createElement(UtensilsCrossed), // Close enough for knives
        color: 'bg-stone-200 text-stone-700',
        subcategories: [
            { id: 'all-knives-hunting', name: 'All Knives & Hunting' },
            { id: 'knives-edc', name: 'Knives & EDC' },
            { id: 'tactical-gear', name: 'Tactical Gear' },
        ]
    },
    {
        id: 'sporting-goods',
        name: 'Sporting Goods', // 'sporting & goods' -> 'Sporting Goods'
        icon: React.createElement(Zap), // Activity/Sport
        color: 'bg-lime-100 text-lime-600',
        subcategories: [
            { id: 'all-sporting-goods', name: 'All Sporting Goods' },
            { id: 'cricket', name: 'Cricket' },
            { id: 'football', name: 'Football' },
            { id: 'soccer', name: 'Soccer' },
            { id: 'skateboard', name: 'Skateboard' },
            { id: 'badminton', name: 'Badminton' },
        ]
    },
    {
        id: 'wholesale',
        name: 'Wholesale',
        icon: React.createElement(Warehouse),
        color: 'bg-gray-200 text-gray-700',
        subcategories: [
            { id: 'all-wholesale', name: 'All Wholesale' },
            { id: 'case-packs-bundles', name: 'Case Packs & Bundles' },
            { id: 'pallets', name: 'Pallets' },
        ]
    },
    {
        id: 'food-drink',
        name: 'Food & Drink',
        icon: React.createElement(UtensilsCrossed),
        color: 'bg-orange-50 text-orange-600',
        subcategories: [
            { id: 'all-food-drink', name: 'All Food & Drink' },
            { id: 'candy-snacks', name: 'Candy & Snacks' }, // 'snakes' -> 'Snacks'
            { id: 'other-food-drink', name: 'Other Food & Drink' },
            { id: 'baked-goods', name: 'Baked Goods' },
            { id: 'fresh-products', name: 'Fresh Products' },
        ]
    },
    {
        id: 'pets',
        name: 'Pets',
        icon: React.createElement(Bone), // Assuming Bone exists or similar, if not we will fix. Bone exists in lucide-react.
        color: 'bg-teal-50 text-teal-600',
        subcategories: [
            { id: 'all-pets', name: 'All Pets' },
            { id: 'dog-cat', name: 'Dog & Cat' },
            { id: 'other-pets', name: 'Other Pets' },
            { id: 'fish', name: 'Fish' },
        ]
    }
];
