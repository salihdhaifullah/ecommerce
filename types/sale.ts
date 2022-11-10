export interface ICreateSale {
    userId: number;
    productId: number;
    totalprice: number;
    numberOfItems: number;
}


export interface ISale {
    productId: number
    quantity: number
}