import axios from 'axios';
import { ICreateProduct, IUpdateProduct } from '../types/product';
import { ILogin, ISingUp } from '../types/user'
import { ICreateFeedback } from '../types/feedBack';
import { ICheckoutData } from '../types/cart';

let baseURL = 'http://localhost:3000/api'
let ISSERVER = typeof window === "undefined";

if (process.env.NODE_ENV === "production" && !ISSERVER) baseURL = `https://${window.location.host}/api`;

const API = axios.create({ baseURL: baseURL })

export const singUp = async (data: ISingUp) => await API.post("/auth/sign-up", data)

export const login = async (data: ILogin) => await API.post("/auth/login", data)

export const Logout = async () => await API.get("/auth/logout")

export const createProduct = async (data: ICreateProduct) => await API.post("/admin/product", data)

export const getCategoriesAndTags = async () => await API.get("/admin/product")

export const getCategories = async (page?: number) => await API.get(`/utils?categories=true&page=${page}`)

export const getProducts = async (category: string, page: number) => await API.get(`/product?category=${category}&page=${page}`)

export const GetProductsLength = async (filter: string | null) => await API.get(`/product?get-length=${true}`)

export const getLikes = async (productId: number) => await API.get(`/like/?id=${productId}`);

export const likeProduct = async (productId: number) => await API.patch(`/like/?id=${productId}`);

export const getCartProducts = async (productsIds: number[]) => await API.post(`/cart`, { ids: productsIds });

export const getHistoryOrders = async (skip: number, take: number, userName?: string, paymentState?: string, deliverState?: string, date?: boolean, totalPrice?: boolean
    ) => await API.get(`/admin/dashboard/history-orders/?skip=${skip}&take=${take}&user-name=${userName || ""}&payment-state=${paymentState || ""}&deliver-state=${deliverState || ""}$date=${date || ""}&total-price=${totalPrice || ""}`)

export const getProductsTable = async (skip: number, take: number, category?: string, title?: string, date?: boolean, likes?: boolean, pieces?: boolean, price?: boolean
    ) => await API.get(`/admin/dashboard/products/?skip=${skip}&take=${take}&category=${category || ""}&title=${title || ""}&date=${date || ""}&likes=${likes || ""}&pieces=${pieces || ""}&price=${price}`)

export const getUsers = async (skip: number, take: number, name?: string, email?: string, date?: boolean, totalPayment?: boolean
    ) => await API.get(`/admin/dashboard/users/?skip=${skip}&take=${take}&name=${name || ""}&email=${email || ""}&date=${date || ""}&total-payment=${totalPayment || ""}`)

export const getFeedBacksTable = async (skip: number, take: number, productTitle?: string, userName?: string, content?: string, rate?: 1 | 2 | 3 | 4 | 5, date?: boolean
    ) => await API.get(`/admin/dashboard/feed-backs/?skip=${skip}&take=${take}&product-title=${productTitle || ""}&user-name=${userName || ""}&content=${content || ""}&rate=${rate || ""}&date=${date || ""}`)

export const getProductToUpdate = async (id: number) => await API.get(`/admin/product?id=${id}`)

export const deleteProduct = async (id: number) => await API.delete(`/admin/product?id=${id}`)

export const updateProduct = async (id: number, data: IUpdateProduct) => await API.patch(`/admin/product?id=${id}`, data)

export const checkoutSessions = async (data: ICheckoutData) => await API.post("/checkout-sessions", data)

export const generalSearch = async (search: string, skip: number, take: number, type: "search" | "tag" | "category") => await API.get(`/search?${type}=${search}&skip=${skip}&take=${take}`)

export const getStatus = async () => await API.get("/admin/dashboard/status")

export const getUsersPayers = async () => await API.get("/admin/dashboard/users-payments-chart")

export const getProductsAverageRate = async () => await API.get("/admin/dashboard/products-rate")

export const getRates = async (productId: number) => await API.get(`/rate/?id=${productId}`);

export const getFeedBacks = async (productId: number) => await API.get(`/feed-back/?id=${productId}`);

export const createFeedBack = async (productId: number, data: ICreateFeedback) => await API.post(`/feed-back/?id=${productId}`, data)

export const deliverOrder = async (id: number) => await API.patch(`/admin/orders/?id=${id}`)

export const demoAccount = async () => await API.get("/auth/demo")
