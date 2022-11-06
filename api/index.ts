import axios from 'axios';
import { IUser } from '../types/user'



let baseURL = 'http://localhost:3000/api'
let ISSERVER = typeof window === "undefined";
let isFoundUser: string | null = null;
let user: IUser | null = null;

if (!ISSERVER) isFoundUser = localStorage.getItem("user");
if (isFoundUser) user = JSON.parse(isFoundUser);

if (process.env.NODE_ENV === "production" && !ISSERVER) {
    baseURL = `https://${window.location.host}/api`;
}

const API = axios.create({ baseURL: baseURL })

API.interceptors.request.use((req) => {
    if (user && req?.headers?.authorization) req.headers.authorization = `Bearer ${user.token}`;
    return req
})