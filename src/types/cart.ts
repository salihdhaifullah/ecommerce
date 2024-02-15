import { InterNationalPhoneNumberInputData } from "./utils";

export interface ICartProduct {
    id: number,
    title: string,
    content: string,
    imageUrl: string,
    createdAt: Date,
    discount: number,
    price: number,
    pieces: number,
}

export interface IOrderDetails {
    address1: string;
    address2: string;
    phoneData: InterNationalPhoneNumberInputData | null;
}


export interface ICheckoutData {
    items: {
        productId: number,
        quantity: number
    }[]
    details: IOrderDetails
}
