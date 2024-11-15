export const CLOSE_ACCESSORIES: Accessory[] = [
    {
        id: 'sadgfdsg',
        name: 'necklace',
        imageUrl: '/assets/accessories/close/gold-chain.png',
        imageWidth: 200,
        imageHeight: 100,
        imageOffset: -250
    },
    {
        id: 'ddsfgsdgsd',
        name: 'hat',
        imageUrl: '/assets/accessories/close/hat.png',
        imageWidth: 300,
        imageHeight: 150,
        imageOffset: 0
    },
    {
        id: 'asfgsdsv',
        name: 'scarf',
        imageUrl: '/assets/accessories/close/scarf.png',
        imageWidth: 250,
        imageHeight: 300,
        imageOffset: -450
    }
];

export const FAR_ACCESSORIES: Accessory[] = [
    {
        id: 'afasf',
        name: 'crewneck',
        imageUrl: '/assets/accessories/far/crewneck.png',
        imageWidth: 425,
        imageHeight: 400,
        imageOffset: -475
    },
    {
        id: 'sdfvsdv',
        name: 'button-up',
        imageUrl: '/assets/accessories/far/button-up.png',
        imageWidth: 425,
        imageHeight: 400,
        imageOffset: -475
    },
];

export const PROXIMITY_THRESHOLD = 80;

export const REGISTERED_USERS: User[] = [
    {
        id: 'abc',
        name: 'Alex',
        likedAccessories: {},
    }
];

export interface User {
    id: string;
    name: string;
    likedAccessories: { [id: string]: Accessory };
}

export interface Accessory {
    id: string;
    name: string;
    imageUrl: string;
    imageWidth?: number;
    imageHeight?: number;
    imageOffset?: number;
}
