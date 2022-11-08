import { ICreateProduct } from "./product";
import { IUser } from "./user";

export interface IUserState {
    user: IUser | null;
    error: string | null;
    massage: string | null;
}

export interface ICreateProductState {
    product: ICreateProduct | null;
    error: string | null;
    massage: string | null;
}