import { useRouter } from "next/router";
import { useState, useCallback, useEffect } from "react";
import Swal from "sweetalert2";
import { IUser } from "../types/user";

export default function useGetUser () {
    // const router = useRouter();

    // const [user, setUser] = useState<IUser | null>(null)
    // const [isBrowser, setIsBrowser] = useState(false)
  
    // const [isExpired, setIsExpired] = useState(false)
    // const [check, setCheck] = useState(0)
  
    // const SwalError = useCallback(() => {
    //   Swal.fire({
    //     title: "you need To login",
    //     text: 'Please login again',
    //     icon: 'error',
    //     confirmButtonText: 'OK',
    //     showCancelButton: true,
    //   }).then((result) => result.value && router.push('/login'));
    // }, [router])
  
    // const getToken = useCallback(async () => {
    //   if (!user) return;
    //   await GetToken().then(({ data }: any) => {
    //     user.token = data.token;
    //     localStorage.setItem('user', JSON.stringify(user))
    //   }).catch(err => {
    //     if (err) SwalError();
    //   })
    // }, [SwalError, user])
  
  
    // const getUser = useCallback(() => {
    //   if (isBrowser) {
    //     const isFound = localStorage.getItem("user");
    //     if (isFound)  setUser(JSON.parse(isFound));
    //   }
    // }, [isBrowser]);
  
    // useEffect(() => {
    //   getUser()
    // }, [getUser])
}