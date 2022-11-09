import { useState, useCallback, useEffect } from "react";
import { IUser } from "../types/user";

export default function useGetUser (): [IUser | null] {

    const [user, setUser] = useState<IUser | null>(null)

    const getUser = useCallback(() => {
        const data: IUser | null = JSON.parse(localStorage.getItem("user") || JSON.stringify(null));
        if (data) setUser(data);
    }, [])

    useEffect(() => {
        getUser()
    }, [getUser])

    return [user];
}