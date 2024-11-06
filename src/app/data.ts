export const REGISTERED_ACCESSORIES: Accessory[] = [
    {
        id: 'afasf',
        name: 'hoodie',
        imageUrl: '/assets/wood-texture.jpg'
    },
    {
        id: 'sdfvsdv',
        name: 'shirt',
        imageUrl: '/assets/wood-texture.jpg'
    },
    {
        id: 'sadgfdsg',
        name: 'necklace',
        imageUrl: '/assets/wood-texture.jpg'
    },
    {
        id: 'ddsfgsdgsd',
        name: 'hat',
        imageUrl: '/assets/wood-texture.jpg'
    },
    {
        id: 'asfgsdsv',
        name: 'scarf',
        imageUrl: '/assets/wood-texture.jpg'
    }
];

export const REGISTERED_USERS: User[] = [
    {
        id: 'abc',
        name: 'Alex',
        likedAccessories: REGISTERED_ACCESSORIES,
    }
];

export interface User {
    id: string;
    name: string;
    likedAccessories: Accessory[];
}

export interface Accessory {
    id: string;
    name: string;
    imageUrl: string;
}
