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

export const getCategories = async (page: number) => await API.get(`/utils?categories=true&page=${page}`)

export const getProducts = async (category: string, page: number) => await API.get(`/product?category=${category}&page=${page}`)

export const GetProductsLength = async (filter: string | null) => await API.get(`/product?get-length=${true}`)

export const getLikes = async (productId: number) => await API.get(`/like/?id=${productId}`);

export const likeProduct = async (productId: number) => await API.patch(`/like/?id=${productId}`);

export const getCartProducts = async (productsIds: number[]) => await API.post(`/cart`, { ids: productsIds });

export const getHistoryOrders = async (skip: number, take: number) => await API.get(`/history-orders/?skip=${skip}&take=${take}`)

export const getProductsTable = async (skip: number, take: number) => await API.get(`/products/?skip=${skip}&take=${take}`)

export const getUsers = async (skip: number, take: number) => await API.get(`/users/?skip=${skip}&take=${take}`)

export const getProductToUpdate = async (id: number) => await API.get(`/admin/product?id=${id}`)

export const deleteProduct = async (id: number) => await API.delete(`/admin/product?id=${id}`)

export const updateProduct = async (id: number, data: IUpdateProduct) => await API.patch(`/admin/product?id=${id}`, data)

export const checkoutSessions = async (data: ICheckoutData) => await API.post("/checkout_sessions", data)

export const generalSearch = async (search: string, skip: number, take: number, type: "search" | "tag" | "category") => await API.get(`/search?${type}=${search}&skip=${skip}&take=${take}`)

export const getStatus = async () => await API.get("/admin/dashboard/status")

export const getUsersPayers = async () => await API.get("/admin/dashboard/users-payments-chart")

export const getProductsAverageRate = async () => await API.get("/admin/dashboard/products-rate")

export const getRates = async (productId: number) => await API.get(`/rate/?id=${productId}`);

export const getFeedBacks = async (productId: number) => await API.get(`/feed-back/?id=${productId}`);

export const createFeedBack = async (productId: number, data: ICreateFeedback) => await API.post(`/feed-back/?id=${productId}`, data)
