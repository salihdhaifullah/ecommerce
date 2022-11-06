import { IUser } from "./user";

export interface IUserState {
    user: IUser | null;
    error: string | null;
    massage: string | null;
}