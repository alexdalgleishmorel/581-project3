export const CLOSE_ACCESSORIES: Accessory[] = [
    {
        id: 'pink-shades',
        name: 'pink-shades',
        imageUrl: '/assets/accessories/close/pink-shades.png',
        imageWidth: 200,
        imageHeight: 75,
        imageOffset: -115
    },
    {
        id: 'another-chain',
        name: 'another-chain',
        imageUrl: '/assets/accessories/close/another-chain.png',
        imageWidth: 300,
        imageHeight: 200,
        imageOffset: -375
    },
    {
        id: 'circle-glasses',
        name: 'circle-glasses',
        imageUrl: '/assets/accessories/close/circle-glasses.png',
        imageWidth: 200,
        imageHeight: 175,
        imageOffset: -150
    },
    {
        id: 'glasses',
        name: 'glasses',
        imageUrl: '/assets/accessories/close/glasses.png',
        imageWidth: 200,
        imageHeight: 175,
        imageOffset: -150
    },
    {
        id: 'touque',
        name: 'touque',
        imageUrl: '/assets/accessories/close/touque.png',
        imageWidth: 300,
        imageHeight: 250,
        imageOffset: -75
    },
    {
        id: 'necklace',
        name: 'necklace',
        imageUrl: '/assets/accessories/close/gold-chain.png',
        imageWidth: 200,
        imageHeight: 100,
        imageOffset: -250
    },
    {
        id: 'cowboyhat',
        name: 'hat',
        imageUrl: '/assets/accessories/close/hat.png',
        imageWidth: 300,
        imageHeight: 150,
        imageOffset: 0
    },
    {
        id: 'scarf',
        name: 'scarf',
        imageUrl: '/assets/accessories/close/scarf.png',
        imageWidth: 250,
        imageHeight: 300,
        imageOffset: -450
    }
];

export const FAR_ACCESSORIES: Accessory[] = [
    {
        id: 'patagonia-jacket',
        name: 'patagonia-jacket',
        imageUrl: '/assets/accessories/far/patagonia-jacket.png',
        imageWidth: 325,
        imageHeight: 275,
        imageOffset: -325
    },
    {
        id: 'flames-jersey',
        name: 'flames-jersey',
        imageUrl: '/assets/accessories/far/flames-jersey.png',
        imageWidth: 325,
        imageHeight: 275,
        imageOffset: -350
    },
    {
        id: 'hawaiian-shirt',
        name: 'hawaiian-shirt',
        imageUrl: '/assets/accessories/far/hawaiian-shirt.png',
        imageWidth: 350,
        imageHeight: 325,
        imageOffset: -350
    },
    {
        id: 'blue-dress',
        name: 'blue-dress',
        imageUrl: '/assets/accessories/far/blue-dress.png',
        imageWidth: 425,
        imageHeight: 400,
        imageOffset: -425
    },
    {
        id: 'suit-top',
        name: 'suit-top',
        imageUrl: '/assets/accessories/far/suit-top.png',
        imageWidth: 250,
        imageHeight: 375,
        imageOffset: -350
    },
    {
        id: 'crewneck',
        name: 'crewneck',
        imageUrl: '/assets/accessories/far/crewneck.png',
        imageWidth: 325,
        imageHeight: 275,
        imageOffset: -325
    },
    {
        id: 'button-up',
        name: 'button-up',
        imageUrl: '/assets/accessories/far/button-up.png',
        imageWidth: 325,
        imageHeight: 275,
        imageOffset: -325
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
