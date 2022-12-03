import axios from 'axios';
import { ICreateComment } from '../types/comment';
import { ICreateProduct, IUpdateProduct } from '../types/product';
import { ISale } from '../types/sale';
import { ILogin, ISingUp, IUser } from '../types/user'

let baseURL = 'http://localhost:3000/api'
let ISSERVER = typeof window === "undefined";
let isFoundUser: string | null = null;
let user: IUser | null = null;


if (!ISSERVER) isFoundUser = localStorage.getItem("user");
if (isFoundUser) user = JSON.parse(isFoundUser);
if (process.env.NODE_ENV === "production" && !ISSERVER) baseURL = `https://${window.location.host}/api`;

const API = axios.create({ baseURL: baseURL })

API.interceptors.request.use((req) => {
    if (user && req.headers) req.headers.authorization = `Bearer ${user.token}`;
    return req
})

export const singUp = async (data: ISingUp) => await API.post("/auth/sign-up", data)

export const login = async (data: ILogin) => await API.post("/auth/login", data)

export const Logout = async () => await API.get("/auth/logout")

export const GetToken = async () => await API.get("/auth/refresh-token");

export const createProduct = async (data: ICreateProduct) => await API.post("/admin/create-product", data)

export const getCategoriesAndTags = async () => await API.get("/admin/create-product")

export const getProducts = async () => await API.get("/product")

export const getComments = async (id: number) => await API.get(`/comment/?id=${id}`)

export const createComment = async (id: number, data: ICreateComment) => await API.post(`/comment/?id=${id}`, data)

export const deleteComment = async (productId: number, commentId: number) => await API.delete(`/comment/?id=${productId}&commentId=${commentId}`);

export const updateComment = async (productId: number, commentId: number, data: ICreateComment) => await API.patch(`/comment/?id=${productId}&commentId=${commentId}`, data);

export const getLikes = async (productId: number) => await API.get(`/like/?id=${productId}`);

export const likeProduct = async (productId: number) => await API.patch(`/like/?id=${productId}`);

export const getRates = async (productId: number) => await API.get(`/rate/?id=${productId}`);

export const createRate = async (productId: number, rateType: {rateType: 1 | 2 | 3 | 4 | 5}) => await API.patch(`/rate/?id=${productId}`, rateType)

export const getCartProducts = async (productsIds: number[]) => await API.post(`/cart`, {ids: productsIds});

export const makePayment = async (data: ISale[]) => await API.post(`/payment`, {data: data});

export const getHistoryOrders = async (skip: number, take: number) => await API.get(`history-orders/?skip=${skip}&take=${take}`)

export const getOrders = async (skip: number, take: number) => await API.get(`orders/?skip=${skip}&take=${take}`)

export const getProductsTable = async (skip: number, take: number) => await API.get(`products/?skip=${skip}&take=${take}`)

export const getUsers = async (skip: number, take: number) => await API.get(`users/?skip=${skip}&take=${take}`)

export const getOrdersLength = async () => await API.get("get-orders-length");

export const getProductToUpdate = async (id: number) => await API.get(`admin/update-product?id=${id}`)

export const deleteProduct = async (id: number) => await API.delete(`admin/update-product?id=${id}`)

export const updateProduct = async (id: number, data: IUpdateProduct) => await API.patch(`admin/update-product?id=${id}`, data)

export const rejectOrder = async (id: number) => await API.patch(`orders/?id=${id}&reject=${true}`)

export const verifyOrder = async (id: number) => await API.patch(`orders/?id=${id}&verify=${true}`)