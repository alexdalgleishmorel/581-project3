export const REGISTERED_ACCESSORIES: Accessory[] = [
    {
        id: 'afasf',
        name: 'hoodie',
        imageUrl: '/assets/wood-texture.jpeg'
    },
    {
        id: 'sdfvsdv',
        name: 'shirt',
        imageUrl: '/assets/wood-texture.jpeg'
    },
    {
        id: 'sadgfdsg',
        name: 'necklace',
        imageUrl: '/assets/wood-texture.jpeg'
    },
    {
        id: 'ddsfgsdgsd',
        name: 'hat',
        imageUrl: '/assets/wood-texture.jpeg'
    },
    {
        id: 'asfgsdsv',
        name: 'scarf',
        imageUrl: '/assets/wood-texture.jpeg'
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
