export class Deck {
    success: boolean;
    deck_id: string;
    shuffled: boolean;
    remaining: number;
}

export class Cards {
    cards: any[];
    deck_id: string;
    remaining: number;
    success: boolean;
}

export class Card {
    code: string;
    image: string;
    images: any;
    suit: string;
    value: string;
    isSelected?: boolean;
    otherValues?:string[];
}